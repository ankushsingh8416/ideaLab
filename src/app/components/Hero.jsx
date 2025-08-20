"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { BsArrowRight } from "react-icons/bs";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <div>
      <section className="relative pt-44 ">
        <div className="container mx-auto text-center px-4">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-5xl md:text-7xl font-bold mb-6 relative z-1"
          >
            <span className="relative inline-block">
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="text-orange-500"
              >
                IdeaLab
              </motion.span>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{
                  duration: 0.5,
                  delay: 0.3,
                  ease: "easeInOut",
                }}
                className="absolute -bottom-2 left-0 -z-10 origin-left"
              >
                <Image
                  src="/images/vector.png"
                  width={500}
                  height={500}
                  alt="underline"
                />
              </motion.div>
            </span>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="text-gray-900"
            >
              — Your AI Research Partner
            </motion.span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
            className="text-xl md:text-2xl text-gray-700 mb-10 max-w-3xl mx-auto"
          >
            Upload any document, paste your notes, or add a URL —
            and instantly chat with AI to understand, summarize,
            and explore insights.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6, ease: "easeOut" }}
          >
            {/* <Link
              href={"/workspace"}
              className="relative border-2 border-amber-700 inline-flex items-center px-8 py-4 rounded-full bg-black overflow-hidden group transition-transform duration-300 hover:scale-105 hover:shadow-[0px_0px_20px_rgba(255,165,0,0.6),0px_0px_40px_rgba(255,20,147,0.6)]"
            >
              <span className="relative flex items-center text-white z-10">
                <span className="mr-2 text-lg tracking-wide bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent transition-transform duration-300">
                  Start Exploring
                </span>
                <BsArrowRight
                  size={24}
                  className="text-orange-500 transition-transform duration-300 group-hover:translate-x-2"
                />
              </span>
            </Link> */}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Hero;
