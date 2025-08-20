"use client";

import Link from "next/link";
import { FaRegCopyright } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaFacebook, FaTwitter, FaLinkedin, FaGithub } from "react-icons/fa";
import Image from "next/image";

const footerLinks = [
  {
    title: "Explore",
    links: [
      { href: "/workspace", label: "Workspace" },
      { href: "/sources", label: "Sources" },
      { href: "/chat", label: "AI Chat" },
    ],
  },
  {
    title: "Features",
    links: [
      { href: "/features/upload", label: "Upload Documents" },
      { href: "/features/url-import", label: "Import from URL" },
      { href: "/features/paste", label: "Paste & Analyze" },
    ],
  },
  {
    title: "Legal & Contact",
    links: [
      { href: "/terms", label: "Terms of Use" },
      { href: "/privacy", label: "Privacy Policy" },
    ],
  },
];

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-10">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo & Tagline */}
        <div className="flex flex-col items-start">
           <div className="cursor-pointer flex items-center">
                    <Image
                      src="/images/logo.png"
                      width={40}
                      height={40}
                      alt="logo"
                      className="hover:rotate-12 transition-transform duration-300"
                    />
                    <span className="font-bold text-white text-lg ml-2">
                      <span className="text-2xl bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-amber-600">
                        i
                      </span>
                      deaLab
                    </span>
                  </div>
          <p className="text-gray-400 mt-2 text-sm">
            Turning Ideas Into Insights
          </p>

          {/* Social Icons */}
          <div className="flex gap-4 mt-4">
            <FaFacebook className="text-gray-400 hover:text-blue-500 transition text-xl cursor-pointer" />
            <FaTwitter className="text-gray-400 hover:text-blue-400 transition text-xl cursor-pointer" />
            <FaLinkedin className="text-gray-400 hover:text-blue-600 transition text-xl cursor-pointer" />
            <FaGithub className="text-gray-400 hover:text-gray-300 transition text-xl cursor-pointer" />
          </div>
        </div>

        {/* Footer Links */}
        {footerLinks.map((section, index) => (
          <div key={index}>
            <h3 className="text-lg font-semibold mb-3 border-b pb-2 border-gray-700">
              {section.title}
            </h3>
            <ul className="space-y-2">
              {section.links.map((link, idx) => (
                <li key={idx}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-amber-400 transition"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Contact Section */}
        <div>
          <h3 className="text-lg font-semibold mb-3 border-b pb-2 border-gray-700">
            Contact
          </h3>
          <a
            href="mailto:support@idealab.ai"
            className="flex items-center gap-2 text-gray-400 hover:text-amber-400 transition"
          >
            <MdEmail className="text-xl" /> support@idealab.ai
          </a>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-8 border-t border-gray-800 pt-6 text-center text-gray-400 text-sm">
        <div className="flex justify-center items-center gap-2">
          <FaRegCopyright className="text-lg" /> {new Date().getFullYear()} Idealab. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
