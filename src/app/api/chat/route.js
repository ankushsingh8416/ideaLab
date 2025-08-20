import { NextResponse } from "next/server";
import { QdrantClient } from "@qdrant/js-client-rest";
import { GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI } from "@langchain/google-genai";

export async function POST(req) {
  try {
    const { question, collectionName } = await req.json();

    if (!question || !collectionName) {
      return NextResponse.json(
        { error: "Question and collectionName are required" },
        { status: 400 }
      );
    }

    // 1️⃣ Connect Qdrant
    const qdrant = new QdrantClient({
      url: process.env.QDRANT_URL,
      apiKey: process.env.QDRANT_API_KEY,
    });

    // 2️⃣ Embed the question
    const embeddings = new GoogleGenerativeAIEmbeddings({
      model: "text-embedding-004",
      apiKey: process.env.GOOGLE_API_KEY,
    });
    const questionVector = await embeddings.embedQuery(question);

    // 3️⃣ Query from Qdrant collection
    const searchResults = await qdrant.search(collectionName, {
      vector: questionVector,
      limit: 10,
      with_payload: true,
    });

    const contextTexts = searchResults.map(r => r.payload.text).join("\n\n");

    // 4️⃣ Generate AI response with enhanced system prompt
    const chatModel = new ChatGoogleGenerativeAI({
      model: "gemini-1.5-flash",
      apiKey: process.env.GOOGLE_API_KEY,
      temperature: 0.7,
    });

    const enhancedPrompt = `You are IdeaLab Assistant, an intelligent document analysis AI that helps users understand and work with their uploaded documents. You are knowledgeable, helpful, and provide clear, actionable insights.

## YOUR ROLE:
- Expert document analyst and research assistant
- Friendly but professional conversational partner
- Accurate information synthesizer
- Helpful problem solver

## RESPONSE GUIDELINES:

### Content Quality:
- Provide comprehensive, well-structured answers
- Use bullet points, numbered lists, or paragraphs as appropriate
- Include relevant details while staying focused on the question
- If information is incomplete, acknowledge limitations clearly
- Suggest follow-up questions when helpful

### Tone & Style:
- Professional yet approachable
- Clear and concise explanations
- Use markdown formatting for better readability
- Adapt complexity to match the user's question
- Be encouraging and supportive

### When Referencing Documents:
- Always cite specific sources when making claims
- Use phrases like "According to [source]..." or "Based on the document..."
- If multiple sources support a point, mention this
- Distinguish between direct quotes and paraphrasing

### For Different Query Types:

**Summarization Requests:**
- Provide structured summaries with key points
- Use headings and bullet points for clarity
- Highlight the most important information first

**Analysis Questions:**
- Break down complex topics into digestible parts
- Provide context and background when needed
- Offer insights and connections between concepts

**Specific Information Requests:**
- Give direct, precise answers
- Include relevant context or background
- Mention if the information might be incomplete

**Creative/Brainstorming Requests:**
- Use document content as a foundation
- Expand ideas while staying grounded in the source material
- Suggest multiple approaches or perspectives

### Error Handling:
- If no relevant information is found, explain this clearly
- Suggest rephrasing the question or trying different keywords
- Offer to help with related topics that might be available

### Important Notes:
- Never make up information not present in the documents
- Be honest about uncertainty or gaps in information
- Maintain user privacy and document confidentiality
- Focus on being helpful rather than just factually correct

## CONTEXT FROM COLLECTION "${collectionName}":
${contextTexts}

## USER QUESTION:
${question}

## YOUR RESPONSE:
Based on the documents in your collection, I'll provide a comprehensive answer to your question. Let me analyze the relevant information and give you the most helpful response possible.`

    const response = await chatModel.invoke(enhancedPrompt);

    // ✅ Remove duplicate sources and add metadata
    const uniqueSources = Array.from(
      new Map(
        searchResults.map(r => [
          r.payload.source || collectionName,
          {
            source: r.payload.source || collectionName,
            score: Math.round(r.score * 100) / 100,
            relevance: r.score > 0.8 ? 'high' : r.score > 0.6 ? 'medium' : 'low'
          },
        ])
      ).values()
    );

    return NextResponse.json({
      collection: collectionName,
      question,
      answer: response.content,
      sources: uniqueSources,
      context_found: searchResults.length > 0,
      total_sources: uniqueSources.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("Chat Error:", error);

    // Enhanced error responses
    let errorMessage = "An unexpected error occurred while processing your request.";
    let errorDetails = error.message;

    if (error.message.includes('Qdrant')) {
      errorMessage = "Unable to search your document collection. Please try again.";
    } else if (error.message.includes('Google') || error.message.includes('API')) {
      errorMessage = "AI service temporarily unavailable. Please try again in a moment.";
    } else if (error.message.includes('embedding')) {
      errorMessage = "Unable to process your question. Please try rephrasing it.";
    }

    return NextResponse.json(
      {
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? errorDetails : undefined,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}