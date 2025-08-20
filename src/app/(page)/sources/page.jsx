"use client";
import React, { useState, useRef, useEffect } from "react";
import {
    Plus, X, File, Link, FileText, Image, Video, Music,
    Archive, Code, Database, Globe
} from "lucide-react";

import useFileStore from "@/store/fileStore";
import useContentStore from "@/store/contentStore";
import useUrlStore from "@/store/urlStore";
import useCollectionStore from "@/store/activechatStore";
import { useRouter } from "next/navigation";
import UploadBox from "@/app/components/UploadBox";
import Footer from "@/app/components/Footer";
import Navbar from "@/app/components/Navbar";

const DataGrid = () => {
    const { files } = useFileStore();
    const { contents } = useContentStore();
    const { urls } = useUrlStore();
    const router = useRouter();
    const setCollectionName = useCollectionStore((state) => state.setCollectionName);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const modalRef = useRef(null);

    // Close popup on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                setIsModalOpen(false);
            }
        };
        if (isModalOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isModalOpen]);

    // 🎨 Color sets
    const colorCombinations = [
        { bg: "bg-blue-50", iconBg: "bg-blue-100", iconColor: "text-blue-600", border: "border-blue-200" },
        { bg: "bg-green-50", iconBg: "bg-green-100", iconColor: "text-green-600", border: "border-green-200" },
        { bg: "bg-purple-50", iconBg: "bg-purple-100", iconColor: "text-purple-600", border: "border-purple-200" },
        { bg: "bg-pink-50", iconBg: "bg-pink-100", iconColor: "text-pink-600", border: "border-pink-200" },
        { bg: "bg-indigo-50", iconBg: "bg-indigo-100", iconColor: "text-indigo-600", border: "border-indigo-200" },
        { bg: "bg-yellow-50", iconBg: "bg-yellow-100", iconColor: "text-yellow-600", border: "border-yellow-200" },
        { bg: "bg-red-50", iconBg: "bg-red-100", iconColor: "text-red-600", border: "border-red-200" },
        { bg: "bg-teal-50", iconBg: "bg-teal-100", iconColor: "text-teal-600", border: "border-teal-200" },
        { bg: "bg-orange-50", iconBg: "bg-orange-100", iconColor: "text-orange-600", border: "border-orange-200" },
        { bg: "bg-cyan-50", iconBg: "bg-cyan-100", iconColor: "text-cyan-600", border: "border-cyan-200" }
    ];

    const getRandomColor = (index) => colorCombinations[index % colorCombinations.length];

    // 📂 Icon selector
    const getIconForFile = (fileName, mimeType) => {
        const extension = fileName?.split(".").pop()?.toLowerCase() || "";
        const type = mimeType?.toLowerCase() || "";

        if (type.includes("image") || ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(extension)) return Image;
        if (type.includes("video") || ["mp4", "avi", "mov", "wmv", "flv"].includes(extension)) return Video;
        if (type.includes("audio") || ["mp3", "wav", "ogg", "flac"].includes(extension)) return Music;
        if (type.includes("pdf") || extension === "pdf") return FileText;
        if (type.includes("spreadsheet") || ["xlsx", "xls", "csv"].includes(extension)) return Database;
        if (["js", "jsx", "ts", "tsx", "py", "java", "cpp", "c", "html", "css"].includes(extension)) return Code;
        if (["zip", "rar", "7z", "tar", "gz"].includes(extension)) return Archive;
        return File;
    };

    const formatFileSize = (size) => {
        if (!size) return "";
        if (size < 1024) return `${size} B`;
        if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;
        return `${Math.round(size / (1024 * 1024))} MB`;
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    const handleItemClick = (item) => {
        if (item._kind === "file") {
            setCollectionName((item.name || "Untitled_File").replace(/[ .]/g, "_"));
        } else if (item._kind === "content") {
            setCollectionName(item.value || "Untitled Content");
        } else if (item._kind === "url") {
            setCollectionName(item.value || "Untitled URL");
        }
        router.push("/chat");
    };

    const allItems = [
        ...files.map((file, index) => ({
            ...file,
            _kind: "file",
            originalIndex: index,
            displayType: "File",
        })),
        ...contents.map((content, index) => ({
            ...content,
            _kind: "content",
            originalIndex: index,
            displayType: "Content",
        })),
        ...urls.map((url, index) => ({
            ...url,
            _kind: "url",
            originalIndex: index,
            displayType: "URL",
        })),
    ];

    return (
        <>
        <Navbar />
               <div className="bg-gray-50 min-h-screen p-30">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-semibold text-gray-900">My Collections</h1>
                    <div className="text-sm text-gray-500">Total: {allItems.length} items</div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {/* Create New */}
                    <div
                        className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all cursor-pointer group hover:scale-105"
                        onClick={() => setIsModalOpen(true)}
                    >
                        <div className="flex flex-col items-center justify-center h-40">
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-gray-200 transition-colors">
                                <Plus className="w-6 h-6 text-gray-500" />
                            </div>
                            <h3 className="font-medium text-gray-900 text-center">Create new collection</h3>
                            <p className="text-xs text-gray-500 mt-1 text-center">Add files, content, or URLs</p>
                        </div>
                    </div>

                    {/* Items */}
                    {allItems.map((item, index) => {
                        const colors = getRandomColor(index);
                        let IconComponent = File;
                        let itemName = item.name || "Untitled";
                        let itemDetails = "";
                        let itemSubtext = "";

                        switch (item._kind) {
                            case "file":
                                IconComponent = getIconForFile(item.name, item.type);
                                itemDetails = formatFileSize(item.size);
                                itemSubtext = item.type || "File";
                                break;
                            case "content":
                                IconComponent = FileText;
                                itemDetails = item.value ? `${item.value.length} characters` : "";
                                itemSubtext = "Text Content";
                                break;
                            case "url":
                                IconComponent = item.value?.startsWith("http") ? Globe : Link;
                                try {
                                    itemDetails = item.value ? new URL(item.value).hostname : "";
                                } catch {
                                    itemDetails = item.value || "";
                                }
                                itemSubtext = "Web Link";
                                break;
                        }

                        return (
                            <div
                                key={`${item._kind}-${item.id || index}`}
                                className={`${colors.bg} ${colors.border} rounded-xl border p-6 hover:shadow-lg transition-all cursor-pointer group hover:scale-105`}
                                onClick={() => handleItemClick(item)}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`w-12 h-12 ${colors.iconBg} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                        <IconComponent className={`w-6 h-6 ${colors.iconColor}`} />
                                    </div>
                                    <span className={`px-2 py-1 text-xs font-medium ${colors.iconColor} ${colors.iconBg} rounded-full`}>
                                        {item.displayType}
                                    </span>
                                </div>

                                <div className="space-y-2">
                                    <h3 className="font-semibold text-gray-900 text-sm truncate" title={itemName}>
                                        {itemName}
                                    </h3>
                                    {itemDetails && (
                                        <p className="text-xs text-gray-600 truncate" title={itemDetails}>
                                            {itemDetails}
                                        </p>
                                    )}
                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                        <span>{itemSubtext}</span>
                                        <span>{formatDate(item.dateAdded || new Date())}</span>
                                    </div>

                                    {item.value && item._kind === "content" && (
                                        <div className="mt-3 p-2 bg-white bg-opacity-50 rounded text-xs text-gray-600 line-clamp-2">
                                            {item.value.length > 60 ? `${item.value.substring(0, 60)}...` : item.value}
                                        </div>
                                    )}
                                    {item._kind === "url" && item.value && (
                                        <div className="mt-3 p-2 bg-white bg-opacity-50 rounded text-xs text-blue-600 truncate">
                                            {item.value}
                                        </div>
                                    )}
                                </div>

                                <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-gray-600">
                                    <span className="mr-1">Click to</span>
                                    {item._kind === "file" && "open chat for this file"}
                                    {item._kind === "content" && "chat about this content"}
                                    {item._kind === "url" && "chat about this link"}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Empty State */}
                {allItems.length === 0 && (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <File className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No items yet</h3>
                        <p className="text-gray-500">Start by creating your first collection</p>
                    </div>
                )}
            </div>

            {/* Popup Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 h-screen overflow-hidden bg-black/50 bg-opacity-10 flex items-center justify-center z-50">
                    <div ref={modalRef} className=" relative">
                        {/* Close Button */}
                        <button
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                            onClick={() => setIsModalOpen(false)}
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <div className="w-8xl">
                            <UploadBox />
                        </div>
                    </div>
                </div>
            )}
        </div>
        <Footer />
        </>
 
    );
};

export default DataGrid;
