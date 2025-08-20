import React, { useState } from "react";
import { FiUpload, FiEdit3, FiLink } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

import UploadTab from "./UploadTab";
import PasteTab from "./PasteTab";
import WebsiteTab from "./WebsiteTab";

const UploadBox = () => {
    const [activeTab, setActiveTab] = useState("upload");
    const [websiteUrl, setWebsiteUrl] = useState("");

    // ✅ Fixed handle upload


    const handlePastedContent = () => console.log("Content pasted:", pastedContent);
    const handleWebsiteUrl = () => console.log("Website URL:", websiteUrl);

    const tabVariants = {
        hidden: { opacity: 0, y: 20, scale: 0.96 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35 } },
        exit: { opacity: 0, y: -20, scale: 0.96, transition: { duration: 0.25 } },
    };

    return (
        <div className="flex flex-col items-center">
            <div className="container my-6 w-full max-w-6xl">
                <div className="w-full bg-white/90 backdrop-blur-md rounded-4xl p-6 md:p-12 shadow-[0_0_25px_-5px_rgba(250,204,21,0.35)]">
                    <div className="flex flex-col items-center justify-center space-y-8">
                        {/* Tabs */}
                        <div className="flex bg-gray-100/80 backdrop-blur-sm rounded-full p-1 mb-6">
                            {[
                                { id: "upload", label: "Upload PDF", icon: <FiUpload /> },
                                { id: "paste", label: "Paste Content", icon: <FiEdit3 /> },
                                { id: "website", label: "Website Link", icon: <FiLink /> },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex cursor-pointer items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300 ${activeTab === tab.id
                                        ? "bg-black text-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.6)]"
                                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
                                        }`}
                                >
                                    <span className="text-lg">{tab.icon}</span>
                                    <span>{tab.label}</span>
                                </button>
                            ))}
                        </div>

                        {/* Content */}
                        <div className="w-full border-2 border-dashed rounded-2xl bg-gray-50/60 border-yellow-300 hover:border-black transition-all duration-300">
                            <AnimatePresence mode="wait">
                                {activeTab === "upload" && (
                                    <motion.div
                                        key="upload"
                                        variants={tabVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                    >
                                        <UploadTab />
                                    </motion.div>
                                )}
                                {activeTab === "paste" && (
                                    <motion.div
                                        key="paste"
                                        variants={tabVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                    >
                                        <PasteTab

                                        />
                                    </motion.div>
                                )}
                                {activeTab === "website" && (
                                    <motion.div
                                        key="website"
                                        variants={tabVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                    >
                                        <WebsiteTab

                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>


                    </div>
                </div>
            </div>
        </div>
    );
};

export default UploadBox;
