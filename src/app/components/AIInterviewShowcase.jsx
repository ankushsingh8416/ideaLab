import React, { useState, useEffect } from 'react';
import { ChevronRight, MessageCircle, Brain, Clock, Link as LinkIcon, FileText, Play, Shield } from 'lucide-react';
import Link from 'next/link';

const AIInterviewShowcase = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Upload & Chat",
      description: "Upload PDFs, docs, or notes and instantly chat with your content to extract key insights.",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50"
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "Write or Paste",
      description: "Paste any text, draft ideas, or write notes and let AI answer questions about it.",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50"
    },
    {
      icon: <LinkIcon className="w-8 h-8" />,
      title: "Learn from URLs",
      description: "Drop any link and AI will fetch resources, analyze the content, and give you answers.",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50"
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Smart Summaries",
      description: "Turn long documents or web pages into concise, actionable summaries instantly.",
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-50"
    }
  ];

  return (
    <div id='features' className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-yellow-100 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-200 to-yellow-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-pink-200 to-orange-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Features Section */}
        <div className={`transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Work Smarter With Your Knowledge
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Upload, paste, or link any resource and start an intelligent conversation powered by AI.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Features List */}
            <div className="space-y-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`group cursor-pointer transition-all duration-300 ${activeFeature === index ? 'scale-105' : 'hover:scale-102'
                    }`}
                  onMouseEnter={() => setActiveFeature(index)}
                >
                  <div className={`p-6 rounded-2xl border-2 transition-all duration-300 ${activeFeature === index
                    ? 'bg-white border-orange-200 shadow-xl'
                    : 'bg-white/50 border-white/20 hover:bg-white/70'
                    }`}>
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${feature.color} text-white transform transition-transform group-hover:scale-110`}>
                        {feature.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                      <ChevronRight className={`w-5 h-5 text-gray-400 transition-all duration-300 ${activeFeature === index ? 'text-orange-500 translate-x-1' : ''
                        }`} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Interactive Demo Area */}
            <div className="relative">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className="ml-4 text-sm text-gray-500 font-medium">AI Knowledge Chat</span>
                </div>

                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl border-l-4 border-blue-400">
                    <div className="flex items-center gap-2 mb-2">
                      <Brain className="w-4 h-4 text-blue-500" />
                      <span className="text-sm font-medium text-blue-700">AI Assistant</span>
                    </div>
                    <p className="text-gray-700">
                      “I’ve scanned your document. Would you like a quick summary or detailed insights?”
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border-l-4 border-green-400">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm font-medium text-green-700">Your Query</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                      </div>
                      <span className="text-sm">Processing your input...</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl border border-orange-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-orange-500" />
                    <span className="text-sm font-medium text-orange-700">AI Insights</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    ✓ Summary generated <br />
                    ✓ Key points extracted <br />
                    💡 Explore related resources for deeper learning
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full animate-bounce delay-500"></div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full animate-bounce delay-1000"></div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className={`text-center mt-20 transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-12 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-pink-500/10"></div>
            <div className="relative z-10">
              <h3 className="text-3xl font-bold mb-4">Ready to Chat with Your Knowledge?</h3>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Upload, paste, or link any resource — let AI turn it into clear answers and summaries in seconds.
              </p>
              <Link
                href={"/workspace/upload"}
                className="cursor-pointer bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 inline-flex items-center gap-2"
              >
                <Play className="w-5 h-5" />
                Start Chatting Now
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIInterviewShowcase;
