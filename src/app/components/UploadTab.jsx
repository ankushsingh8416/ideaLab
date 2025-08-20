"use client";
import React, { useRef, useState, useCallback, useMemo } from "react";
import Image from "next/image";
import { FiUpload } from "react-icons/fi";
import { ArrowRight, X, FileText, File } from "lucide-react";
import toast from "react-hot-toast";
import useFileStore from "@/store/fileStore";
import Link from "next/link";
import useCollectionStore from "@/store/activechatStore";

const UploadTab = () => {
  const fileInputRef = useRef(null);
  const { addFile, files } = useFileStore(); // Store just metadata
  const [currentUploads, setCurrentUploads] = useState([]);
  const setCollectionName = useCollectionStore((state) => state.setCollectionName);
  console.log(files)
  // File icons
  const getFileIcon = useCallback((fileName) => {
    const ext = fileName.split(".").pop()?.toLowerCase();
    const icons = {
      pdf: <FileText className="h-5 w-5 text-red-500" />,
      doc: <FileText className="h-5 w-5 text-blue-500" />,
      docx: <FileText className="h-5 w-5 text-blue-500" />,
      txt: <FileText className="h-5 w-5 text-gray-500" />,
    };
    return icons[ext] || <File className="h-5 w-5 text-gray-400" />;
  }, []);

  // File size formatter
  const formatFileSize = useCallback((bytes) => {
    if (!bytes) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (bytes / Math.pow(k, i)).toFixed(2) + " " + sizes[i];
  }, []);

  // Remove upload from list
  const handleRemoveUpload = useCallback((uploadId) => {
    setCurrentUploads(prev => {
      const fileToRemove = prev.find(u => u.id === uploadId);
      if (fileToRemove) {
        toast.success(`Removed: ${fileToRemove.name}`);
      }
      return prev.filter(u => u.id !== uploadId);
    });
  }, []);

  // Trigger file input
  const handleClick = useCallback(() => fileInputRef.current?.click(), []);

  // Handle upload
  const handleFileChange = useCallback(async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Validation
    const allowedTypes = [
      "application/pdf",
      "text/plain",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      toast.error("Only PDF, DOCX, DOC, or TXT files are allowed.");
      e.target.value = "";
      return;
    }

    if (selectedFile.size > 20 * 1024 * 1024) {
      toast.error("Maximum file size is 20MB.");
      e.target.value = "";
      return;
    }

    // Check for duplicate files
    const isDuplicate = currentUploads.some(upload =>
      upload.name === selectedFile.name && upload.size === selectedFile.size
    );

    if (isDuplicate) {
      toast.error("This file has already been uploaded.");
      e.target.value = "";
      return;
    }

    const uploadId = Date.now() + Math.random();
    const uploadItem = {
      id: uploadId,
      name: selectedFile.name,
      size: selectedFile.size,
      status: "uploading",
      file: selectedFile
    };

    setCurrentUploads(prev => [...prev, uploadItem]);
    toast.loading(`Uploading: ${selectedFile.name}`);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Upload failed with status ${res.status}`);
      }

      const result = await res.json();

      // Update to completed - DON'T auto-remove
      setCurrentUploads(prev =>
        prev.map(u => u.id === uploadId ? { ...u, status: "completed" } : u)
      );

      // Save metadata in store
      addFile({
        id: uploadId,
        name: selectedFile.name,
        size: selectedFile.size,
        uploadedAt: new Date().toISOString()
      });

      toast.dismiss(); // Remove loading toast
      toast.success(`Uploaded successfully: ${selectedFile.name}`);

    } catch (err) {
      console.error("Upload failed:", err);

      setCurrentUploads(prev =>
        prev.map(u => u.id === uploadId ? { ...u, status: "failed", error: err.message } : u)
      );

      toast.dismiss(); // Remove loading toast
      toast.error(`Upload failed: ${err.message}`);
    } finally {
      e.target.value = "";
    }
  }, [addFile, currentUploads]);

  // Retry failed upload
  const handleRetryUpload = useCallback(async (uploadId) => {
    const uploadItem = currentUploads.find(u => u.id === uploadId);
    if (!uploadItem || !uploadItem.file) return;

    setCurrentUploads(prev =>
      prev.map(u => u.id === uploadId ? { ...u, status: "uploading", error: undefined } : u)
    );

    toast.loading(`Retrying upload: ${uploadItem.name}`);

    try {
      const formData = new FormData();
      formData.append("file", uploadItem.file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Upload failed with status ${res.status}`);
      }

      await res.json();

      setCurrentUploads(prev =>
        prev.map(u => u.id === uploadId ? { ...u, status: "completed" } : u)
      );

      addFile({
        id: uploadId,
        name: uploadItem.name,
        size: uploadItem.size,
        uploadedAt: new Date().toISOString()
      });

      toast.dismiss();
      toast.success(`Upload successful: ${uploadItem.name}`);

    } catch (err) {
      console.error("Retry failed:", err);

      setCurrentUploads(prev =>
        prev.map(u => u.id === uploadId ? { ...u, status: "failed", error: err.message } : u)
      );

      toast.dismiss();
      toast.error(`Retry failed: ${err.message}`);
    }
  }, [currentUploads, addFile]);

  // Clear all completed uploads
  const handleClearCompleted = useCallback(() => {
    setCurrentUploads(prev => prev.filter(u => u.status !== "completed"));
    toast.success("Cleared completed uploads");
  }, []);

  // Derived states
  const hasUploads = useMemo(() => currentUploads.length > 0, [currentUploads]);
  const hasActiveUploads = useMemo(() => currentUploads.some(u => u.status === "uploading"), [currentUploads]);
  const hasCompleted = useMemo(() => currentUploads.some(u => u.status === "completed"), [currentUploads]);
  const hasFailed = useMemo(() => currentUploads.some(u => u.status === "failed"), [currentUploads]);
  // Format collection name
  const formatCollectionName = useCallback((name) => {
    return name
      .replace(/[ .]/g, "_");
  }, []);
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 md:px-12">
      {/* Upload Icon */}
      {!hasUploads && (
        <div
          className={`relative w-32 h-32 mb-8 cursor-pointer transition-transform hover:scale-110 ${hasActiveUploads ? "opacity-50 pointer-events-none" : ""
            }`}
          onClick={handleClick}
        >
          <Image src="/images/file.png" alt="Upload File" fill className="object-contain" priority />
        </div>
      )}

      {/* Current Uploads */}
      {hasUploads && (
        <div className="mt-6 w-full max-w-2xl bg-gray-50 border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Current Uploads ({currentUploads.length})
            </h4>

            {hasCompleted && (
              <button
                onClick={handleClearCompleted}
                className="text-sm cursor-pointer text-gray-500 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-100"
              >
                Clear Completed
              </button>
            )}
          </div>

          <div className="space-y-3">
            {currentUploads.map(upload => (
              <div
                key={upload.id}
                className={`flex items-center justify-between p-3 border rounded-lg transition-all ${upload.status === "uploading"
                  ? "bg-blue-50 border-blue-200"
                  : upload.status === "completed"
                    ? "bg-green-50 border-green-200"
                    : "bg-red-50 border-red-200"
                  }`}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {upload.status === "uploading" ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                  ) : (
                    getFileIcon(upload.name)
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate flex items-center gap-2">
                      {upload.name}
                      {upload.status === "uploading" && (
                        <span className="text-xs text-blue-600 font-medium">Uploading...</span>
                      )}
                      {upload.status === "completed" && (
                        <span className="text-xs text-green-600 font-medium">Completed</span>
                      )}
                      {upload.status === "failed" && (
                        <span className="text-xs text-red-600 font-medium">Failed</span>
                      )}
                    </p>
                    <p className="text-xs text-gray-500">{formatFileSize(upload.size)}</p>
                    {upload.error && (
                      <p className="text-xs text-red-500 mt-1">{upload.error}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {upload.status === "failed" && (
                    <button
                      onClick={() => handleRetryUpload(upload.id)}
                      className="text-xs cursor-pointer px-2 py-1 bg-red-100 text-red-700 hover:bg-red-200 rounded"
                    >
                      Retry
                    </button>
                  )}
                  <button
                    onClick={() => handleRemoveUpload(upload.id)}
                    disabled={upload.status === "uploading"}
                    className={`p-1 text-gray-400  hover:text-red-500 hover:bg-red-50 rounded-full transition-colors ${upload.status === "uploading" ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    title={`Remove ${upload.name}`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info */}
      {!hasUploads && (
        <>
          <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 text-center">
            Click to Upload Your Document
          </h3>
          <p className="text-gray-600 text-sm md:text-base text-center mb-6 max-w-md">
            Upload PDF, DOCX, DOC, or TXT file. Maximum size: 20MB.
          </p>
        </>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4 my-4">
        {/* Upload Button */}
        <button
          type="button"
          onClick={handleClick}
          disabled={hasActiveUploads || currentUploads.length > 0}
          className={`flex   items-center gap-2 bg-black text-yellow-400 px-8 py-3 rounded-full font-medium transition-all 
    ${hasActiveUploads || currentUploads.length > 0
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-gray-800 hover:shadow-lg cursor-pointer"
            }`}
        >
          <FiUpload className="h-5 w-5" />
          <span>
            {hasActiveUploads
              ? "Uploading..."
              : currentUploads.length > 0
                ? "Remove current upload first"
                : "Upload Document"}
          </span>
        </button>

        {/* Continue Button */}
        {hasCompleted && !hasActiveUploads && (
          <Link
            href="/chat"
            onClick={() => {
              const firstCompleted = currentUploads.find(u => u.status === "completed");
              if (firstCompleted) {
                const collectionName = formatCollectionName(firstCompleted.name);
                console.log(`Continuing with collection: ${collectionName}`);
                setCollectionName(collectionName);
              }
            }}
            className="flex cursor-pointer items-center gap-2 bg-black text-yellow-400 px-8 py-3 rounded-full font-medium hover:bg-gray-800 hover:shadow-lg transition-all"
          >
            <span>Continue</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        )}
      </div>

      {/* Status Summary */}
      {hasUploads && (
        <div className="mt-4 text-sm text-gray-600 text-center">
          {hasActiveUploads && <p>Upload in progress...</p>}
          {hasFailed && <p className="text-red-600">Some uploads failed. Click retry to try again.</p>}
          {hasCompleted && !hasActiveUploads && !hasFailed && (
            <p className="text-green-600">All uploads completed successfully!</p>
          )}
        </div>
      )}

      {/* Hidden Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.txt"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
    </div>
  );
};

export default UploadTab;