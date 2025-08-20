"use client";
import React from "react";
import {
  FaQuestionCircle,
  FaArrowRight,
  FaMagic,
  FaRocket,
  FaShieldAlt,
  FaCheck,
  FaStar,
} from "react-icons/fa";

export const Transform = () => {
  return (
    <div id="workspace" className="flex flex-col lg:flex-row items-center lg:items-stretch my-12 lg:my-16 justify-between w-full min-h-[600px] bg-gradient-to-br from-amber-50 via-white to-orange-50 p-6 sm:p-8 lg:p-12 rounded-3xl border border-amber-100 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full blur-sm"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-gradient-to-br from-orange-300 to-amber-400 rounded-full blur-sm"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-gradient-to-br from-yellow-300 to-amber-400 rounded-full blur-sm"></div>
      </div>

      {/* Left Side Content */}
      <div className="w-full lg:w-1/2 lg:pr-12 max-w-2xl relative z-10 flex flex-col justify-center">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-r from-amber-400 to-orange-500 p-3 rounded-xl shadow-lg">
              <FaMagic className="text-white text-xl" />
            </div>
            <span className="bg-gradient-to-r from-amber-500 to-orange-600 text-transparent bg-clip-text text-sm font-bold uppercase tracking-wider">
              AI Knowledge Tools
            </span>
            <div className="bg-amber-400 text-gray-800 text-xs px-3 py-1 rounded-full font-bold shadow-md">
              BETA
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-800 mb-6 leading-tight">
            Transform Your Notes into
            <span className="bg-gradient-to-r from-amber-500 to-orange-600 text-transparent bg-clip-text block mt-2">
              Insights & Summaries
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed pl-6 border-l-4 border-amber-400">
            Upload documents, paste content, or add links — and let{" "}
            <span className="font-semibold text-amber-600">IdeaLab</span>{" "}
            instantly generate clear answers, structured notes, and AI-powered summaries.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="text-center p-4 bg-white/60 rounded-xl border border-amber-100 hover:bg-white/80 transition-all duration-300">
            <FaRocket className="text-amber-500 text-2xl mx-auto mb-2" />
            <span className="text-sm font-semibold text-gray-700">
              Quick Answers
            </span>
          </div>
          <div className="text-center p-4 bg-white/60 rounded-xl border border-amber-100 hover:bg-white/80 transition-all duration-300">
            <FaShieldAlt className="text-green-500 text-2xl mx-auto mb-2" />
            <span className="text-sm font-semibold text-gray-700">
              Source Reliable
            </span>
          </div>
          <div className="text-center p-4 bg-white/60 rounded-xl border border-amber-100 hover:bg-white/80 transition-all duration-300">
            <FaStar className="text-purple-500 text-2xl mx-auto mb-2" />
            <span className="text-sm font-semibold text-gray-700">
              Smart Summaries
            </span>
          </div>
        </div>

        {/* Help Section */}
        <div className="flex items-start gap-3 bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-xl border border-amber-200 mb-6">
          <FaQuestionCircle className="text-amber-500 text-xl flex-shrink-0 mt-1" />
          <div>
            <p className="text-gray-700 text-sm sm:text-base mb-2">
              Need help uploading your sources?
            </p>
            <button className="text-amber-600 hover:text-amber-700 font-semibold underline decoration-amber-300 hover:decoration-amber-500 transition-all">
              Get step-by-step guidance →
            </button>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-3">
          <span className="px-4 py-2 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-full text-sm font-semibold shadow-lg flex items-center gap-2">
            <FaCheck className="text-xs" />
            Free to Start
          </span>
          <span className="px-4 py-2 bg-gradient-to-r from-blue-400 to-purple-500 text-white rounded-full text-sm font-semibold shadow-lg">
            AI-Powered
          </span>
          <span className="px-4 py-2 bg-gradient-to-r from-orange-400 to-red-500 text-white rounded-full text-sm font-semibold shadow-lg">
            Context-Aware
          </span>
        </div>
      </div>

      {/* Right Side - Visual */}
      <div className="w-full lg:w-1/2 flex items-center justify-center mt-8 lg:mt-0 relative">
        <div className="relative w-full max-w-lg">
          {/* Glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 rounded-3xl blur-2xl opacity-20 scale-110"></div>

          {/* Card */}
          <div className="relative bg-white rounded-3xl shadow-2xl p-8 border border-amber-100">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                From Raw Notes to Smart Insights
              </h3>

              {/* Old Notes */}
              <div className="bg-gray-100 rounded-xl p-6 mb-4 border-l-4 border-red-400">
                <div className="text-left">
                  <div className="h-3 bg-gray-300 rounded mb-2 w-3/4"></div>
                  <div className="h-2 bg-gray-200 rounded mb-2 w-1/2"></div>
                  <div className="h-2 bg-gray-200 rounded mb-3 w-2/3"></div>
                  <div className="text-xs text-red-500 font-semibold">
                    ❌ Unstructured
                  </div>
                </div>
              </div>

              {/* Arrow */}
              <div className="flex justify-center mb-4">
                <div className="bg-gradient-to-r from-amber-400 to-orange-500 p-3 rounded-full">
                  <FaArrowRight className="text-white text-xl rotate-90 lg:rotate-0" />
                </div>
              </div>

              {/* New Insights */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-l-4 border-green-400">
                <div className="text-left">
                  <div className="h-3 bg-green-400 rounded mb-2 w-4/5"></div>
                  <div className="h-2 bg-green-300 rounded mb-2 w-3/5"></div>
                  <div className="h-2 bg-green-300 rounded mb-3 w-3/4"></div>
                  <div className="text-xs text-green-600 font-semibold flex items-center gap-1">
                    <FaCheck /> Clear Insights
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-amber-50 rounded-xl p-4">
                <div className="text-2xl font-bold text-amber-600">90%</div>
                <div className="text-sm text-gray-600">Faster Research</div>
              </div>
              <div className="bg-green-50 rounded-xl p-4">
                <div className="text-2xl font-bold text-green-600">2x</div>
                <div className="text-sm text-gray-600">Better Recall</div>
              </div>
            </div>
          </div>

          {/* Floating Icons */}
          <div className="absolute -top-4 -right-4 bg-gradient-to-r from-purple-400 to-pink-500 text-white p-3 rounded-full shadow-lg">
            <FaMagic className="text-lg" />
          </div>
          <div className="absolute -bottom-4 -left-4 bg-gradient-to-r from-blue-400 to-cyan-500 text-white p-3 rounded-full shadow-lg">
            <FaRocket className="text-lg" />
          </div>
        </div>
      </div>
    </div>
  );
};
