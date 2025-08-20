import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { NextResponse } from "next/server";
import { QdrantClient } from "@qdrant/js-client-rest";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { Document } from "@langchain/core/documents";

export async function POST(req) {
  try {
    let collectionName;
    let docs = [];
    let sourceUrl = null;

    // Detect request type
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      // -------- FILE UPLOAD CASE --------
      const formData = await req.formData();
      const file = formData.get("file");

      if (!file) {
        return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
      }

      const loader = new PDFLoader(file);
      docs = await loader.load();
      collectionName = file.name.replace(/[^a-zA-Z0-9_-]/g, '_');

      // Add metadata for PDFs
      docs = docs.map(
        (d) =>
          new Document({
            pageContent: d.pageContent,
            metadata: { ...d.metadata, source: file.name, type: "pdf" },
          })
      );
    } else {
      // -------- JSON BODY CASE --------
      const body = await req.json();
      const { content, collectionName: bodyCollectionName, url } = body;

      if (content?.trim()) {
        // Case: Pasted Content
        collectionName = bodyCollectionName || `pasted_content_${Date.now()}`;
        docs = [
          new Document({
            pageContent: content,
            metadata: { source: "pasted", type: "text" },
          }),
        ];
      } else if (url?.trim()) {
        // -------- ENHANCED URL CASE --------
        console.log(`Processing URL: ${url}`);
        sourceUrl = url;

        // Validate URL format
        try {
          new URL(url);
        } catch (error) {
          return NextResponse.json(
            { error: "Invalid URL format" },
            { status: 400 }
          );
        }

        // Create collection name from URL
        const urlObj = new URL(url);
        const domain = urlObj.hostname.replace('www.', '');
        const path = urlObj.pathname.split('/').filter(Boolean).join('_');
        collectionName = bodyCollectionName ||
          `${domain}_${path || 'homepage'}_${Date.now()}`.replace(/[^a-zA-Z0-9_-]/g, '_');

        try {
          // Enhanced web loader with better configuration
          const loader = new CheerioWebBaseLoader(url, {
            selector: "body", // Load entire body content
            // Remove scripts, styles, and navigation elements
            removeElements: ["script", "style", "nav", "header", "footer", ".advertisement", ".ads"]
          });

          docs = await loader.load();

          if (!docs || docs.length === 0) {
            return NextResponse.json(
              { error: "Could not extract content from URL" },
              { status: 400 }
            );
          }

          // Enhanced metadata for websites
          docs = docs.map((d) => {
            // Clean the content - remove extra whitespace and normalize
            const cleanContent = d.pageContent
              .replace(/\s+/g, ' ')
              .replace(/\n\s*\n/g, '\n')
              .trim();

            return new Document({
              pageContent: cleanContent,
              metadata: {
                ...d.metadata,
                source: url,
                type: "website",
                domain: urlObj.hostname,
                title: d.metadata?.title || "Unknown Title",
                timestamp: new Date().toISOString(),
                path: urlObj.pathname
              },
            });
          });

          console.log(`Successfully loaded content from ${url}`);
          console.log(`Content length: ${docs[0]?.pageContent?.length || 0} characters`);

        } catch (error) {
          console.error(`Error loading URL ${url}:`, error.message);
          return NextResponse.json(
            { error: `Failed to load content from URL: ${error.message}` },
            { status: 400 }
          );
        }
      } else {
        return NextResponse.json(
          { error: "No content or URL provided" },
          { status: 400 }
        );
      }
    }

    // -------- Enhanced chunking strategy --------
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1500, // Increased for better context
      chunkOverlap: 300, // Increased overlap for better continuity
      separators: ["\n\n", "\n", ". ", "! ", "? ", " ", ""], // Better separators
    });

    const allDocs = await splitter.splitDocuments(docs);
    console.log(`Total chunks after split: ${allDocs.length}`);

    // Filter out very small chunks
    const filteredDocs = allDocs.filter(doc => doc.pageContent.trim().length >= 50);
    console.log(`Chunks after filtering: ${filteredDocs.length}`);

    if (filteredDocs.length === 0) {
      return NextResponse.json(
        { error: "No substantial content found after processing" },
        { status: 400 }
      );
    }

    // -------- Init Qdrant --------
    let qdrant;
    try {
      qdrant = new QdrantClient({
        url: process.env.QDRANT_URL,
        apiKey: process.env.QDRANT_API_KEY,
      });
    } catch {
      qdrant = new QdrantClient({
        url: process.env.QDRANT_URL || "http://localhost:6333",
      });
    }

    const embeddings = new GoogleGenerativeAIEmbeddings({
      modelName: "embedding-001",
      apiKey: process.env.GOOGLE_API_KEY,
    });

    // -------- Generate embeddings with better error handling --------
    const vectors = [];
    let validDocs = 0;
    const failedChunks = [];

    for (let i = 0; i < filteredDocs.length; i++) {
      const doc = filteredDocs[i];
      if (!doc.pageContent?.trim()) continue;

      try {
        const vector = await embeddings.embedQuery(doc.pageContent);
        vectors.push({
          id: validDocs + 1,
          vector,
          payload: {
            text: doc.pageContent,
            source: doc.metadata?.source || "",
            type: doc.metadata?.type || "unknown",
            domain: doc.metadata?.domain || "",
            title: doc.metadata?.title || "",
            page: doc.metadata?.loc?.pageNumber || 0,
            chunk_index: validDocs,
            timestamp: doc.metadata?.timestamp || new Date().toISOString(),
            path: doc.metadata?.path || "",
            char_count: doc.pageContent.length
          },
        });
        validDocs++;

        // Add small delay to avoid rate limiting
        if (validDocs % 5 === 0) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }

      } catch (err) {
        console.error(`Error embedding chunk ${i}:`, err.message);
        failedChunks.push(i);
      }
    }

    if (!vectors.length) {
      return NextResponse.json({
        error: "No valid vectors created",
        failedChunks: failedChunks.length
      }, { status: 400 });
    }

    // -------- Ensure collection with better naming --------
    let collectionExists = false;
    try {
      await qdrant.getCollection(collectionName);
      collectionExists = true;
      console.log(`Using existing collection: ${collectionName}`);
    } catch (error) {
      if (error.status !== 404) throw error;
    }

    if (!collectionExists) {
      console.log(`Creating new collection: ${collectionName}`);
      await qdrant.createCollection(collectionName, {
        vectors: {
          size: vectors[0].vector.length,
          distance: "Cosine"
        },
      });
      // Wait for collection to be ready
      await new Promise((r) => setTimeout(r, 2000));
    }

    // -------- Upsert vectors in batches --------
    const batchSize = 8; // Reduced for better stability
    let successfulUpserts = 0;

    for (let i = 0; i < vectors.length; i += batchSize) {
      const batch = vectors.slice(i, i + batchSize);
      try {
        await qdrant.upsert(collectionName, {
          wait: true,
          points: batch,
        });
        successfulUpserts += batch.length;
        console.log(`Upserted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(vectors.length / batchSize)}`);
      } catch (error) {
        console.error(`Failed to upsert batch ${i}-${i + batchSize}:`, error.message);
      }
    }

    // -------- Success response with enhanced info --------
    const response = {
      message: sourceUrl ?
        `Website content from ${sourceUrl} successfully processed and embedded` :
        "Content uploaded & embedded successfully in Qdrant",
      collection: collectionName,
      source: sourceUrl || "uploaded file/content",
      documentsLoaded: docs.length,
      chunksCreated: filteredDocs.length,
      vectorsCreated: vectors.length,
      vectorsUpserted: successfulUpserts,
      failedEmbeddings: failedChunks.length,
      contentPreview: docs[0]?.pageContent?.substring(0, 200) + "..." || "",
      timestamp: new Date().toISOString()
    };

    console.log("Processing completed successfully:", response);
    return NextResponse.json(response);

  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json(
      {
        error: `Upload failed: ${error.message}`,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}