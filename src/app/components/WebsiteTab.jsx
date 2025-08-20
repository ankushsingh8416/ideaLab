"use client";
import Image from "next/image";
import { FiLink, FiLoader } from "react-icons/fi";
import { useState } from "react";
import useUrlStore from "@/store/urlStore";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import useCollectionStore from "@/store/activechatStore";

const WebsiteTab = () => {
  const { addUrl, urls } = useUrlStore();
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setCollectionName } = useCollectionStore();

  console.log(urls);

  const handleWebsiteUrl = async () => {
    if (!websiteUrl.trim()) return;

    const collectionName = `url_${Date.now()}`;

    setLoading(true);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ collectionName, url: websiteUrl }),
      });

      const data = await res.json();
      console.log("Response:", data);

      if (!res.ok) throw new Error(data.error || "Failed to import website");

      // ✅ Store in Zustand
      addUrl(collectionName, websiteUrl);

      setWebsiteUrl(""); // clear input
      toast.success("Website imported successfully ✅");
      setCollectionName(collectionName);
      router.push("/chat");
    } catch (err) {
      console.error(err);
      toast.error("Error importing website ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 md:p-14 lg:p-16 flex flex-col items-center justify-center">
      <div className="relative w-28 h-28 transition-transform hover:scale-110 mb-4">
        <Image
          src="/images/link.png"
          alt="Import website"
          fill
          className="object-contain"
          priority
        />
      </div>

      <div className="text-center max-w-2xl mb-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          Import from Website
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed">
          Enter a website URL to extract and analyze its content. Blog posts,
          docs, or articles – all supported.
        </p>
      </div>

      <div className="w-full max-w-2xl space-y-4">
        <input
          type="url"
          value={websiteUrl}
          onChange={(e) => setWebsiteUrl(e.target.value)}
          placeholder="https://example.com/article"
          className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-yellow-400 focus:outline-none text-gray-700"
          disabled={loading}
        />
        
        <button
          onClick={handleWebsiteUrl}
          disabled={!websiteUrl.trim() || loading}
          className={`
            flex items-center justify-center gap-2 
            px-8 py-3 rounded-full font-medium 
            transition-all duration-200 mx-auto
            min-w-[160px]
            ${loading 
              ? 'bg-gray-100 text-gray-600 cursor-not-allowed' 
              : 'bg-black text-yellow-400 hover:bg-gray-900 hover:scale-105 cursor-pointer'
            }
            ${!websiteUrl.trim() && !loading ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : ''}
          `}
        >
          {loading ? (
            <>
              <FiLoader className="h-5 w-5 animate-spin" />
              <span>Importing...</span>
            </>
          ) : (
            <>
              <FiLink className="h-5 w-5" />
              <span>Import Website</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default WebsiteTab;