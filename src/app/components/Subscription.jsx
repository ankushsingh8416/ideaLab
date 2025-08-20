"use client"
import React, { useEffect, useState } from 'react';
import { Check, Brain, Target, Zap, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useSubscriptionStore } from '@/store/subscriptionStore';


const Subscription = () => {
    const [isYearly, setIsYearly] = useState(false);
    const { serviceName } = useSubscriptionStore();

    const plans = {
        free: {
            name: "Free",
            price: { monthly: 0, yearly: 0 },
            tagline: "Start exploring AI-powered insights",
            features: [
                "Upload up to 3 documents",
                "Paste and chat with any text",
                "Basic URL source integration",
                "Summaries & key takeaways",
                "Limited follow-up questions",
                "Community support",
            ],
        },
        pro: {
            name: "Pro",
            price: { monthly: 599, yearly: 499 }, // in INR
            tagline: "Best for students & professionals",
            features: [
                "Upload up to 50 documents",
                "Full URL & resource extraction",
                "Advanced AI-powered summaries",
                "Citations & trusted source linking",
                "Unlimited follow-up questions",
                "Export insights to PDF/Doc",
                "Priority email support",
            ],
        },
        proPlus: {
            name: "Pro Plus",
            price: { monthly: 999, yearly: 799 }, // in INR
            tagline: "Ultimate research & collaboration suite",
            features: [
                "Everything in Pro",
                "Unlimited document uploads",
                "Team workspace & collaboration",
                "Deep-dive analysis across sources",
                "Context-aware smart search",
                "Custom insight reports",
                "1-on-1 onboarding support",
                "VIP chat & email support",
            ],
        },
    };


    const router = useRouter()


    // Payment intigration with Razorpay
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);
    }, []);

    const handlePayment = async () => {
        if (!userSession) {
            setShowPopup(true);
            return
        }
        // Call Razorpay API
        const res = await fetch("/api/razorpay", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                amount,
                userEmail: userSession?.user?.email,
                serviceName: plan,
                billingCycle
            }),
        });

        const order = await res.json();


        const options = {
            key: process.env.RAZORPAY_KEY_ID || "rzp_test_R9imru43nM8kiI",
            amount: order.amount,
            currency: order.currency,
            name: "Resucraft",
            description: "Test Transaction",
            order_id: order.id,
            handler: async function () {
                const verifyRes = await fetch("/api/razorpay/verify", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(response),
                });

                const data = await verifyRes.json();

                if (data.success) {
                    toast.success("Payment successful & verified!");
                    router.push('/')
                } else {
                    toast.error("Payment failed or verification failed.");
                }
            },

            theme: {
                color: "#DB6E33",
            },
        };


        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rzp = new (window).Razorpay(options);
        rzp.open();
    };


    return (
        <div id='subscription' className="min-h-screen relative overflow-hidden">
            {/* Light Background matching website theme */}
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 via-orange-50 to-yellow-100">
                <div className="absolute inset-0 bg-gradient-to-t from-orange-50/30 to-transparent"></div>
                <div className="absolute top-0 left-0 w-full h-full">
                    <div className="absolute top-20 left-20 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
                    <div className="absolute top-40 right-20 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000"></div>
                    <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-4000"></div>
                </div>

                {/* Subtle Pattern */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-100/30 to-transparent bg-[size:50px_50px] bg-[image:radial-gradient(circle_at_center,orange_1px,transparent_1px)] opacity-20"></div>
            </div>

            <div className="relative z-10 py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-20">
                        <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm border border-orange-200 rounded-full px-6 py-2 mb-6 shadow-lg">
                            <Sparkles className="w-4 h-4 text-orange-500" />
                            <span className="text-gray-700 font-medium">AI-Powered Resume Technology</span>
                        </div>

                        <h1 className="text-6xl font-bold mb-6 leading-tight">
                            <span className="bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500 bg-clip-text text-transparent">
                                Transform Your Career
                            </span>
                            <br />
                            <span className="text-gray-800 text-4xl">with AI Intelligence</span>
                        </h1>

                        <p className="text-xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
                            Upload any resume and watch our AI transform it into ATS-optimized perfection.
                            Get personalized interview training and real-time feedback to land your dream job.
                        </p>

                        {/* Pricing Toggle */}
                        <div className="flex justify-center items-center space-x-4 mb-12">
                            <span className={`font-semibold ${!isYearly ? 'text-orange-600' : 'text-gray-500'}`}>Monthly</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" checked={isYearly} onChange={() => setIsYearly(!isYearly)} className="sr-only peer" />
                                <div className="w-12 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                            </label>
                            <span className={`font-semibold ${isYearly ? 'text-orange-600' : 'text-gray-500'}`}>
                                Yearly
                                <span className="ml-2 bg-green-100 text-green-700 px-2 py-1 rounded-md text-xs font-bold">20% OFF</span>
                            </span>
                        </div>
                    </div>





                    {/* Compact Pricing Section */}
                    <div className="max-w-6xl mx-auto">


                        {/* Compact Pricing Cards */}
                        <div className="grid md:grid-cols-3 gap-6">
                            {Object.values(plans).map((plan) => (
                                <div key={plan.name} className={`relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${plan.name === 'Pro' ? 'border-2 border-orange-400 shadow-orange-200 scale-105' : 'border border-gray-200'}`}>
                                    {plan.name === 'Pro' && (
                                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                            <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">Most Popular</span>
                                        </div>
                                    )}
                                    <div className="text-center">
                                        <h3 className="text-xl font-bold text-gray-800">{plan.name}</h3>
                                        <p className="text-gray-500 text-sm mb-4">{plan.tagline}</p>
                                        <div className="mb-6">
                                            <span className="text-4xl font-extrabold text-gray-900">₹{isYearly ? plan.price.yearly : plan.price.monthly}</span>
                                            <span className="text-gray-500">/mo</span>
                                        </div>
                                    </div>
                                    {serviceName === plan.name ? (
                                        <div className="w-full py-2.5 rounded-lg font-bold text-sm mb-6 text-center bg-green-100 text-green-700 border border-green-300 cursor-default">
                                            ✅ Your Active Plan
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() =>
                                                handlePayment(
                                                    isYearly ? plan.price.yearly : plan.price.monthly,
                                                    plan.name,
                                                    isYearly ? "yearly" : "monthly"
                                                )
                                            }
                                            className={`w-full cursor-pointer py-2.5 rounded-lg font-bold text-sm transition-all duration-300 mb-6 ${plan.name === 'Pro'
                                                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:shadow-orange-300 hover:shadow-lg'
                                                : plan.name === 'Pro Plus'
                                                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-purple-300 hover:shadow-lg'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                        >
                                            {plan.name === 'Free' ? 'Start Free' : 'Get Started'}
                                        </button>
                                    )}

                                    <ul className="space-y-2">
                                        {plan.features.map((feature, i) => (
                                            <li key={i} className="flex items-start space-x-2">
                                                <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                <span className="text-gray-600 text-sm">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>















                    {/* Features Highlight */}
                    <div className="mt-20 bg-white/80 backdrop-blur-xl border border-orange-200 rounded-3xl p-12 shadow-xl">
                        <h3 className="text-3xl font-bold text-gray-800 text-center mb-12">
                            Why Choose Our AI Knowledge Platform?
                        </h3>
                        <div className="grid md:grid-cols-4 gap-8">
                            {/* Upload Documents */}
                            <div className="text-center">
                                <div className="bg-gradient-to-br from-orange-400 to-red-400 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <Brain className="w-8 h-8 text-white" />
                                </div>
                                <h4 className="text-gray-800 font-bold mb-2">Upload Any Document</h4>
                                <p className="text-gray-600 text-sm">
                                    Easily upload PDFs, Word files, or notes and let AI extract insights for you.
                                </p>
                            </div>

                            {/* Paste / Write Content */}
                            <div className="text-center">
                                <div className="bg-gradient-to-br from-purple-400 to-indigo-400 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <Target className="w-8 h-8 text-white" />
                                </div>
                                <h4 className="text-gray-800 font-bold mb-2">Write or Paste Text</h4>
                                <p className="text-gray-600 text-sm">
                                    Just paste any content or notes and start chatting with AI for explanations.
                                </p>
                            </div>

                            {/* Add URL */}
                            <div className="text-center">
                                <div className="bg-gradient-to-br from-green-400 to-emerald-400 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <Sparkles className="w-8 h-8 text-white" />
                                </div>
                                <h4 className="text-gray-800 font-bold mb-2">Use Any URL</h4>
                                <p className="text-gray-600 text-sm">
                                    Provide a website link and AI will gather knowledge directly from that source.
                                </p>
                            </div>

                            {/* Chat with AI */}
                            <div className="text-center">
                                <div className="bg-gradient-to-br from-blue-400 to-cyan-400 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <Zap className="w-8 h-8 text-white" />
                                </div>
                                <h4 className="text-gray-800 font-bold mb-2">Chat with Your Data</h4>
                                <p className="text-gray-600 text-sm">
                                    Interact with all your uploaded content through a powerful AI chat interface.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Subscription;