"use client";
import Image from "next/image";
import { FiEdit3, FiLink, FiLoader } from "react-icons/fi";
import { useState } from "react";
import useContentStore from "@/store/contentStore";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import useCollectionStore from "@/store/activechatStore";

const PasteTab = () => {
  const { addContent, contents } = useContentStore();
  const [pastedContent, setPastedContent] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter()
  const { setCollectionName } = useCollectionStore();

  const handlePastedContent = async () => {
    if (!pastedContent.trim()) return;
    const collectionName = `collection_${Date.now()}`; // 👈 unique name

    setLoading(true);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          collectionName,
          content: pastedContent,
        }),
      });

      const data = await res.json();
      console.log("Response:", data);

      if (!res.ok) {
        throw new Error(data.error || "Failed to process content");
      }

      // ✅ store in Zustand array
      addContent(collectionName, pastedContent);

      setPastedContent(""); // reset textarea
      setCollectionName(collectionName)
      toast.success("Content uploaded successfully ✅");
      router.push("/chat")

    } catch (err) {
      console.error(err);
      toast.error("Error uploading content ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" p-10 md:p-14 lg:p-16 flex flex-col items-center justify-center">
      <div className="relative w-28 h-28 transition-transform hover:scale-110 mb-4">
        <Image
          src="/images/paste.png"
          alt="File upload"
          fill
          className="object-contain"
          priority
        />
      </div>

      <div className="text-center max-w-2xl mb-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          Paste Your Content
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed">
          Paste any text (100+ words) to analyze instantly – articles, emails, or notes.        </p>
      </div>

      <div className="w-full max-w-2xl space-y-4">
        <textarea
          value={pastedContent}
          onChange={(e) => setPastedContent(e.target.value)}
          placeholder="Paste your content here..."
          className="w-full h-40 p-4 border-2 border-gray-200 rounded-xl focus:border-yellow-400 focus:outline-none resize-none text-gray-700"
        />
        <div className="flex justify-center gap-4">
          <button
            onClick={handlePastedContent}
            disabled={!pastedContent.trim() || loading}
            className="flex cursor-pointer items-center gap-2 bg-black text-yellow-400 px-8 py-3 rounded-full font-medium hover:bg-gray-900 hover:scale-105 transition-all disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed "
          >

            {loading ? (
              <>
                <FiLoader className="h-5 w-5 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <FiLink className="h-5 w-5" />
                <span>Process Content</span>
              </>
            )}
          </button>



        </div>
      </div>
    </div>
  );
};

export default PasteTab;
