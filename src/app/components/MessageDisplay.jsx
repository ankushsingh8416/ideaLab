import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useState } from "react";

export default function MessageRenderer({ content }) {
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const noteRegex = /\*\*(note|important|warning|tip|key|remember|example):\*\*([\s\S]*?)(?=\n\n|\*\*|$)/gi;
    const bulletListRegex = /^(\*\s+.+(?:\n(?!\*\s+|\n).+)*)+/gm;
    const numberedListRegex = /^(\d+\.\s+.+(?:\n(?!\d+\.\s+|\n).+)*)+/gm;
    const boldRegex = /\*\*(.+?)\*\*/g;
    const italicRegex = /\*(.+?)\*/g;
    const inlineCodeRegex = /`([^`]+)`/g;

    let parts = [];
    let partIndex = 0;

    const highlightImportant = (text) => {
        const importantWords = ["important", "note", "warning", "tip", "key", "remember", "example", "critical", "essential"];
        const regex = new RegExp(`\\b(${importantWords.join("|")})\\b`, "gi");

        return text.split(regex).map((part, i) => {
            if (importantWords.some(word => word.toLowerCase() === part.toLowerCase())) {
                return (
                    <span key={i} className="font-bold text-gray-900">
                        {part}
                    </span>
                );
            }
            return part;
        });
    };

    const formatText = (text) => {
        // Handle inline code first
        let formattedText = text.replace(inlineCodeRegex, (match, code) => {
            return `<code class="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-red-600">${code}</code>`;
        });

        // Handle bold text
        formattedText = formattedText.replace(boldRegex, (match, content) => {
            return `<strong class="font-bold text-gray-900">${content}</strong>`;
        });

        // Handle italic text
        formattedText = formattedText.replace(italicRegex, (match, content) => {
            return `<em class="italic">${content}</em>`;
        });

        return formattedText;
    };

    const renderFormattedText = (text, key) => {
        const formattedHtml = formatText(text);
        const highlightedText = highlightImportant(formattedHtml);

        return (
            <span
                key={key}
                dangerouslySetInnerHTML={{
                    __html: typeof highlightedText === 'string' ? highlightedText : formattedHtml
                }}
            />
        );
    };

    const renderNote = (type, content, key) => {
        const noteStyles = {
            note: "bg-orange-50 border-l-4 border-orange-400 text-orange-800",
            important: "bg-red-50 border-l-4 border-red-400 text-red-800",
            warning: "bg-orange-50 border-l-4 border-orange-400 text-orange-800",
            tip: "bg-green-50 border-l-4 border-green-400 text-green-800",
            key: "bg-purple-50 border-l-4 border-purple-400 text-purple-800",
            remember: "bg-indigo-50 border-l-4 border-indigo-400 text-indigo-800",
            example: "bg-teal-50 border-l-4 border-teal-400 text-teal-800"
        };

        const iconMap = {
            note: "📝",
            important: "⚠️",
            warning: "🚨",
            tip: "💡",
            key: "🔑",
            remember: "🧠",
            example: "📋"
        };

        const styleClass = noteStyles[type.toLowerCase()] || noteStyles.note;
        const icon = iconMap[type.toLowerCase()] || "📝";

        return (
            <div key={key} className={`${styleClass} p-4 rounded-lg my-4`}>
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{icon}</span>
                    <span className="font-bold text-sm uppercase">{type}</span>
                </div>
                <div className="text-sm leading-relaxed">
                    {renderFormattedText(content.trim(), key)}
                </div>
            </div>
        );
    };

    const renderBulletList = (listText, key) => {
        const items = listText.split('\n').filter(line => line.trim().startsWith('*'));

        return (
            <div key={key} className="my-4">
                <ul className="space-y-2 list-none ml-0">
                    {items.map((item, index) => {
                        const cleanItem = item.replace(/^\*\s*/, '').trim();
                        return (
                            <li key={index} className="flex items-start gap-3 text-gray-700">
                                <span className="text-orange-600 text-sm mt-1 flex-shrink-0">•</span>
                                <div className="text-sm leading-6 flex-1">
                                    {renderFormattedText(cleanItem, index)}
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>
        );
    };

    const renderNumberedList = (listText, key) => {
        const items = listText.split('\n').filter(line => /^\d+\.\s+/.test(line.trim()));

        return (
            <div key={key} className="my-4">
                <ol className="space-y-2 list-none ml-0">
                    {items.map((item, index) => {
                        const numberMatch = item.match(/^(\d+)\./);
                        const originalNumber = numberMatch ? numberMatch[1] : (index + 1).toString();
                        const cleanItem = item.replace(/^\d+\.\s*/, '').trim();
                        return (
                            <li key={index} className="flex items-start gap-3 text-gray-700">
                                <span className="text-orange-600 text-sm mt-1 flex-shrink-0 font-semibold">
                                    {originalNumber}.
                                </span>
                                <div className="text-sm leading-6 flex-1">
                                    {renderFormattedText(cleanItem, index)}
                                </div>
                            </li>
                        );
                    })}
                </ol>
            </div>
        );
    };

    const renderParagraph = (text, key) => {
        const cleanText = text.trim();
        if (!cleanText) return null;

        return (
            <div key={key} className=" mb-4 text-sm leading-7 space-y-3">
                {cleanText.split('\n\n').map((paragraph, i) => (
                    <p key={i} className="leading-7">
                        {renderFormattedText(paragraph, i)}
                    </p>
                ))}
            </div>
        );
    };

    // Collect all matches with their positions
    const noteMatches = Array.from(content.matchAll(noteRegex));
    const bulletMatches = Array.from(content.matchAll(bulletListRegex));
    const numberedMatches = Array.from(content.matchAll(numberedListRegex));
    const codeMatches = Array.from(content.matchAll(codeBlockRegex));

    const allMatches = [
        ...noteMatches.map(match => ({
            type: 'note',
            match,
            start: match.index,
            end: match.index + match[0].length
        })),
        ...bulletMatches.map(match => ({
            type: 'bullet',
            match,
            start: match.index,
            end: match.index + match[0].length
        })),
        ...numberedMatches.map(match => ({
            type: 'numbered',
            match,
            start: match.index,
            end: match.index + match[0].length
        })),
        ...codeMatches.map(match => ({
            type: 'code',
            match,
            start: match.index,
            end: match.index + match[0].length
        }))
    ].sort((a, b) => a.start - b.start);

    let currentIndex = 0;

    allMatches.forEach((matchObj) => {
        // Add any text before this match
        if (currentIndex < matchObj.start) {
            const textPart = content.slice(currentIndex, matchObj.start);
            if (textPart.trim()) {
                parts.push(renderParagraph(textPart, partIndex++));
            }
        }

        // Add the matched content
        if (matchObj.type === 'note') {
            const [fullMatch, type, noteContent] = matchObj.match;
            parts.push(renderNote(type, noteContent, partIndex++));
        } else if (matchObj.type === 'bullet') {
            parts.push(renderBulletList(matchObj.match[0], partIndex++));
        } else if (matchObj.type === 'numbered') {
            parts.push(renderNumberedList(matchObj.match[0], partIndex++));
        } else if (matchObj.type === 'code') {
            const [, lang, code] = matchObj.match;
            parts.push(
                <CodeBlock code={code.trim()} lang={lang || "javascript"} key={partIndex++} />
            );
        }

        currentIndex = matchObj.end;
    });

    // Add any remaining text
    if (currentIndex < content.length) {
        const remainingText = content.slice(currentIndex);
        if (remainingText.trim()) {
            parts.push(renderParagraph(remainingText, partIndex++));
        }
    }

    return <div className="space-y-4 max-w-none leading-relaxed">{parts}</div>;
}

// Clean Code Block Component
function CodeBlock({ code, lang }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative my-8 rounded-xl overflow-hidden border border-gray-800 shadow-2xl bg-black">
            {/* Dark header with high contrast */}
            <div className="bg-gray-900 px-6 py-3 flex justify-between items-center border-b border-gray-700">
                <div className="flex items-center gap-3">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <span className="text-gray-300 text-sm font-mono uppercase tracking-wider">
                        {lang}
                    </span>
                </div>
                <button
                    onClick={handleCopy}
                    className="text-xs bg-gray-800 cursor-pointer hover:bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                >
                    {copied ? "✓ Copied!" : "📋 Copy"}
                </button>
            </div>

            <div className="relative">
                <SyntaxHighlighter
                    language={lang}
                    style={vscDarkPlus}
                    showLineNumbers
                    wrapLongLines
                    customStyle={{
                        background: "#0a0a0a",
                        margin: 0,
                        padding: "2rem",
                        fontSize: "0.9rem",
                        lineHeight: "1.7",
                        fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'SF Mono', monospace",
                    }}
                    lineNumberStyle={{
                        color: "#4a5568",
                        backgroundColor: "transparent",
                        paddingRight: "2rem",
                        minWidth: "3rem",
                        fontSize: "0.8rem",
                        borderRight: "1px solid #2d3748",
                        marginRight: "1rem",
                    }}
                >
                    {code}
                </SyntaxHighlighter>
            </div>
        </div>
    );
}