"use client"

import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageSquare, User, FileText, Menu, X, Trash2, AlertCircle, RefreshCw, Brain, Sparkles, BookOpen, Target, Plus, ArrowLeft } from 'lucide-react';
import useCollectionStore from '@/store/activechatStore';
import MessageRenderer from '@/app/components/MessageDisplay';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const IdeaLabChat = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [activeChat, setActiveChat] = useState('default-chat');
  const [chatHistory, setChatHistory] = useState([]);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const messagesEndRef = useRef(null);
  const { collectionName } = useCollectionStore();
  const router = useRouter();

  const suggestedQuestions = [
    {
      icon: <BookOpen className="w-4 h-4" />,
      text: "Summarize the key  from my documents"
    },
    {
      icon: <Target className="w-4 h-4" />,
      text: "What are the main themes discussed?"
    },
    {
      icon: <FileText className="w-4 h-4" />,
      text: "Create an executive summary"
    },
    {
      icon: <Sparkles className="w-4 h-4" />,
      text: "Find actionable recommendations"
    }
  ];

  // Redirect to sources if no collection name
  useEffect(() => {
    if (collectionName === " " || !collectionName) {
      router.push("/sources");
    }
  }, [collectionName, router]);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Initialize default chat on component mount
  useEffect(() => {
    const defaultChat = {
      id: 'default-chat',
      title: 'Chat with Documents',
      preview: 'Ask questions about your documents',
      time: 'Now',
      active: true,
      messages: [],
      collectionName: collectionName
    };

    setChatHistory([defaultChat]);
    setMessages([]);
  }, [collectionName]);

  const createNewChat = () => {
    // Save current messages to current chat before creating new one
    const updatedHistory = chatHistory.map(chat =>
      chat.id === activeChat
        ? { ...chat, messages: messages, active: false }
        : { ...chat, active: false }
    );

    // Create new chat
    const newChatId = `chat-${Date.now()}`;
    const newChat = {
      id: newChatId,
      title: 'New Chat',
      preview: 'Start a new conversation',
      time: 'Now',
      active: true,
      messages: [],
      collectionName: collectionName
    };

    // Add new chat to history
    const newChatHistory = [newChat, ...updatedHistory];
    setChatHistory(newChatHistory);

    // Switch to new chat
    setActiveChat(newChatId);
    setMessages([]);
    setError(null);
    setRetryCount(0);
  };

  const switchChat = (chatId) => {
    // Save current messages to current chat
    const updatedHistory = chatHistory.map(chat => {
      if (chat.id === activeChat) {
        return { ...chat, messages: messages, active: false };
      } else if (chat.id === chatId) {
        return { ...chat, active: true };
      } else {
        return { ...chat, active: false };
      }
    });

    setChatHistory(updatedHistory);

    // Load messages for selected chat
    const selectedChat = updatedHistory.find(chat => chat.id === chatId);
    setMessages(selectedChat.messages || []);
    setActiveChat(chatId);

    setError(null);
  };

  const deleteChat = (chatId, e) => {
    e.stopPropagation();
    if (chatHistory.length <= 1) return;

    const updatedHistory = chatHistory.filter(chat => chat.id !== chatId);
    setChatHistory(updatedHistory);

    if (activeChat === chatId) {
      if (updatedHistory.length > 0) {
        const firstChat = updatedHistory[0];
        setActiveChat(firstChat.id);
        setMessages(firstChat.messages || []);

        setChatHistory(prev => prev.map(chat =>
          chat.id === firstChat.id ? { ...chat, active: true } : { ...chat, active: false }
        ));
      } else {
        setActiveChat(null);
        setMessages([]);
      }
    }
  };

  const updateChatTitle = (chatId, newTitle) => {
    setChatHistory(prev => prev.map(chat =>
      chat.id === chatId ? { ...chat, title: newTitle } : chat
    ));
  };

  const updateChatPreview = (chatId, preview, time = 'Just now') => {
    setChatHistory(prev => prev.map(chat =>
      chat.id === chatId ? { ...chat, preview, time } : chat
    ));
  };

  const callChatAPI = async (question, collection, retries = 0) => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: question,
          collectionName: collectionName
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API call failed:', error);

      if (retries < 2 && (error.message.includes('fetch') || error.message.includes('network'))) {
        console.log(`Retrying API call... (attempt ${retries + 1})`);
        await new Promise(resolve => setTimeout(resolve, 1000 * (retries + 1)));
        return callChatAPI(question, collection, retries + 1);
      }

      throw error;
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || loading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    const currentQuestion = inputMessage;
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);

    const currentChat = chatHistory.find(chat => chat.id === activeChat);
    if (currentChat && (currentChat.title === 'Chat with Documents' || currentChat.title === 'New Chat' || messages.length === 0)) {
      const title = inputMessage.slice(0, 30) + (inputMessage.length > 30 ? '...' : '');
      updateChatTitle(activeChat, title);
    }

    updateChatPreview(activeChat, inputMessage.slice(0, 50) + (inputMessage.length > 50 ? '...' : ''));

    setInputMessage('');
    setLoading(true);
    setError(null);
    setRetryCount(0);

    try {
      const response = await callChatAPI(currentQuestion, collectionName);

      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: response.answer,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: response.sources || [],
        metadata: {
          collection: response.collection,
          totalSources: response.total_sources,
          contextFound: response.context_found
        }
      };
      const finalMessages = [...newMessages, botMessage];
      setMessages(finalMessages);

      setChatHistory(prev => prev.map(chat =>
        chat.id === activeChat
          ? { ...chat, messages: finalMessages }
          : chat
      ));

    } catch (error) {
      console.error('Send message error:', error);

      const errorMessage = {
        id: Date.now() + 1,
        type: 'error',
        content: `Sorry, I encountered an error: ${error.message}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        error: true
      };
      const finalMessages = [...newMessages, errorMessage];
      setMessages(finalMessages);

      setChatHistory(prev => prev.map(chat =>
        chat.id === activeChat
          ? { ...chat, messages: finalMessages }
          : chat
      ));

      setError(error.message);
      setRetryCount(prev => prev + 1);
    } finally {
      setLoading(false);
    }
  };

  const retryLastMessage = () => {
    if (messages.length < 2) return;

    const lastUserMessage = [...messages].reverse().find(msg => msg.type === 'user');
    if (lastUserMessage) {
      const messagesWithoutLast = messages.slice(0, -1);
      setMessages(messagesWithoutLast);
      setInputMessage(lastUserMessage.content);
    }
  };

  const TypingIndicator = () => (
    <div className="flex items-center space-x-2">
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
        <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
      </div>
      <span className="text-sm text-gray-500">AI is thinking...</span>
    </div>
  );

  const MessageSources = ({ sources }) => {
    if (!sources || sources.length === 0) return null;

    return (
      <div className="mt-3 pt-3 border-t border-gray-100">
        <p className="text-xs text-gray-500 mb-2">Sources:</p>
        <div className="flex flex-wrap gap-1">
          {sources.map((source, index) => {
            const isLink = source.source.startsWith("https");
            const content = (
              <span
                className={`text-xs px-2 py-1 rounded-full cursor-pointer ${source.relevance === 'high'
                    ? 'bg-green-100 text-green-800'
                    : source.relevance === 'medium'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-600'
                  }`}
              >
                {source.source} ({Math.round(source.score * 100)}%)
              </span>
            );

            return isLink ? (
              <a
                key={index}
                href={source.source}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-blue-600"
              >
                {content}
              </a>
            ) : (
              <span key={index}>{content}</span>
            );
          })}

        </div>
      </div>
    );
  };

  const currentChat = chatHistory.find(chat => chat.id === activeChat);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 bg-white border-r border-gray-200 flex flex-col overflow-hidden shadow-sm`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-semibold text-gray-900">IdeaLab Chat</h1>
                <p className="text-xs text-gray-500 flex items-center">
                  <Sparkles className="w-3 h-3 mr-1" />
                  AI Assistant
                </p>
              </div>
            </div>
            <button
              className="p-1.5 cursor-pointer hover:bg-gray-100 rounded-xl transition-colors"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          {/* New Chat Button */}
          <button
            onClick={createNewChat}
            className=" my-4 w-full p-3 bg-gradient-to-r hover:from-orange-300 hover:to-orange-400 from-orange-400 to-orange-500 text-white rounded-2xl flex items-center justify-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span className="font-medium">New Chat</span>
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4">
          <h2 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
            <MessageSquare className="w-4 h-4 mr-2" />
            Chat History
          </h2>
          {chatHistory.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Loading...</p>
            </div>
          ) : (
            <div className="space-y-2">
              {chatHistory.map(chat => (
                <div
                  key={chat.id}
                  className={`group p-3 rounded-2xl cursor-pointer transition-all duration-200 relative ${chat.active
                    ? 'bg-gradient-to-r from-orange-50 to-orange-100 border-2 border-orange-200'
                    : 'hover:bg-gray-50 border-2 border-transparent'
                    }`}
                  onClick={() => switchChat(chat.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-300 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                      <FileText className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0 pr-6">
                      <h3 className="font-medium text-gray-900 truncate text-sm">
                        {chat.title}
                      </h3>
                      <p className="text-xs text-gray-500 truncate mt-0.5">
                        {chat.preview}
                      </p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-gray-400 flex items-center">
                          <MessageSquare className="w-3 h-3 mr-1" />
                          {chat.time}
                        </span>
                      </div>
                    </div>
                    {chatHistory.length > 1 && (
                      <button
                        onClick={(e) => deleteChat(chat.id, e)}
                        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3 text-red-500" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 bg-white border-b shadow-lg border-gray-200">
          <div className="flex items-center justify-between space-x-3">
            {!sidebarOpen && (
              <button
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
            )}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900 flex items-center">
                  {currentChat?.title || 'AI Chat'}
                  <Sparkles className="w-4 h-4 ml-2 text-orange-500" />
                </h2>
                <p className="text-sm text-gray-500 flex items-center">
                  <BookOpen className="w-3 h-3 mr-1" />
                  Ask questions about your documents
                </p>
              </div>
            </div>
            <Link
              href={"/sources"}
              className="flex items-center gap-2 px-4 rounded-full border-2 border-red-500 bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:scale-105 transition-all duration-200"
            >
              <ArrowLeft className="h-3 w-3" /> {/* smaller icon */}
              <span>Exit</span>
            </Link>

          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="px-4 py-3 bg-red-50 border-b border-red-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <span className="text-sm text-red-700">{error}</span>
              </div>
              {retryCount > 0 && (
                <button
                  onClick={retryLastMessage}
                  className="text-sm text-red-600 hover:text-red-800 flex items-center space-x-1 px-2 py-1 rounded-lg hover:bg-red-100 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Retry</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Messages Area */}
        <div className="flex-1 overflow-y-scroll relative">
          {messages.length === 0 ? (
            // Welcome state
            <div className="flex flex-col items-center justify-center h-full p-8">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-3xl flex items-center justify-center mb-4 mx-auto shadow-2xl">
                  <Brain className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2 flex items-center justify-center">
                  Welcome to IdeaLab Chat
                  <Sparkles className="w-6 h-6 ml-2 text-orange-500" />
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Ask me anything about your documents. I can analyze, summarize, and provide insights.
                </p>
              </div>

              <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-4">
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    className="p-4 cursor-pointer text-left bg-white hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-100 rounded-2xl transition-all duration-300 border-2 border-gray-100 hover:border-orange-200 shadow-sm hover:shadow-md group"
                    onClick={() => setInputMessage(question.text)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                        {question.icon}
                      </div>
                      <span className="text-sm text-gray-700 font-medium">{question.text}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-6 space-y-6">
              {messages.map(message => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-2xl ${message.type === 'user' ? 'text-right' : ''}`}>
                    <div className="flex items-start space-x-3">
                      {(message.type === 'bot' || message.type === 'error') && (
                        <div className={`w-8 h-8 ${message.type === 'error'
                          ? 'bg-gradient-to-br from-red-500 to-red-600'
                          : 'bg-gradient-to-br from-orange-500 to-orange-600'
                          } rounded-2xl flex text-white items-center justify-center flex-shrink-0 mt-1 shadow-lg`}>
                          {message.type === 'error' ? (
                            <AlertCircle className="w-4 h-4 text-white" />
                          ) : (
                            <Brain className="w-4 h-4 text-white" />
                          )}
                        </div>
                      )}
                      <div className={`px-5 py-4 rounded-3xl shadow-sm ${message.type === 'user'
                        ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-tr-lg'
                        : message.type === 'error'
                          ? 'bg-red-50 text-red-800 rounded-tl-lg border border-red-200'
                          : 'bg-white text-gray-800 rounded-tl-lg border border-gray-200'
                        }`}>
                        <MessageRenderer content={message.content} />
                        {message.sources && <MessageSources sources={message.sources} />}
                      </div>
                      {message.type === 'user' && (
                        <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-700 rounded-2xl flex items-center justify-center flex-shrink-0 mt-1 shadow-lg">
                          <User className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                    <p className={`text-xs text-gray-400 mt-2 ${message.type === 'user' ? 'mr-11' : 'ml-11'
                      }`}>
                      {message.time}
                    </p>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="max-w-2xl">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center flex-shrink-0 mt-1 shadow-lg">
                        <Brain className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-white rounded-3xl rounded-tl-lg px-5 py-4 border border-gray-200 shadow-sm">
                        <TypingIndicator />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-gray-200">
          <div className="flex space-x-3 max-w-4xl mx-auto">
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                className="w-full px-5 py-4 pr-14 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey && !loading && activeChat && inputMessage.trim()) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                disabled={loading}
              />
              <button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || loading}
                className="absolute cursor-pointer right-2 top-1/2 transform -translate-y-1/2 p-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:bg-gray-300 text-white rounded-2xl transition-all disabled:cursor-not-allowed shadow-lg hover:shadow-xl disabled:shadow-none"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
          <p className="text-xs text-gray-500 text-center mt-3 flex items-center justify-center">
            <Sparkles className="w-3 h-3 mr-1" />
            IdeaLab AI can make mistakes. Consider checking important information.
          </p>
        </div>
      </div>
    </div>
  );
};

export default IdeaLabChat;