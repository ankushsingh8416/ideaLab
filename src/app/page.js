"use client";
import React from "react";
import { motion } from "framer-motion"; // ✅ import motion
import { Transform } from "./components/Transform";
import AIInterviewShowcase from "./components/AIInterviewShowcase";
import Subscription from "./components/Subscription";
import Hero from "./components/Hero";
import UploadBox from "./components/UploadBox";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// ✅ animation variants
const fadeUpVariant = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const Home = () => {
  return (
    <div>
              <Navbar/>

      <div className="resume-container relative">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUpVariant}
        >
          <Hero />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUpVariant}
        >
          <UploadBox />
        </motion.div>

      </div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeUpVariant}
      >
        <Transform />
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeUpVariant}
      >
        <AIInterviewShowcase />
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeUpVariant}
      >
        <Subscription />
      </motion.div>
      <Footer />
    </div>
  );
};

export default Home;
