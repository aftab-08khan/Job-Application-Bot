"use client";

import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import Link from "next/link";
import { useState } from "react";

const MODEL_NAME = "gemini-1.0-pro";
const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

export default function AIJobApplication() {
  const [emailData, setEmailData] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [profession, setProfession] = useState("");
  const [skills, setSkills] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [company, setCompany] = useState("");

  async function runChat(prompt) {
    try {
      setIsLoading(true);
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: MODEL_NAME });

      const generationConfig = {
        temperature: 0.7,
        topK: 1,
        topP: 1,
        maxOutputTokens: 300,
      };

      const safetySettings = [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ];

      const chat = model.startChat({
        generationConfig,
        safetySettings,
      });

      const result = await chat.sendMessage(prompt);
      const response = await result.response;
      const emailText = response.text();
      setEmailData(emailText);

      const subjectMatch = emailText.match(/Subject: (.+)/);
      const bodyMatch = emailText.match(/Email Body: (.+)/s);

      if (subjectMatch && bodyMatch) {
        setSubject(subjectMatch[1]);
        setBody(bodyMatch[1]);
      } else {
        setSubject("Subject not found");
        setBody(emailText);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setEmailData("Error: Failed to generate email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!name || !profession || !skills || !jobRole || !company) {
      setEmailData("Please fill in all the fields.");
      return;
    }

    const prompt = `
      Generate a professional job application email maximum 15 lines. 
      - Name: ${name}
      - Profession: ${profession}
      - Skills: ${skills}
      - Job Role: ${jobRole}
      - Company Name: ${company}

      Format:
      - Subject: [Formal subject line]
      - Email Body: [Structured email with greeting, introduction, skills, request for interview, and closing statement.]
    `;

    await runChat(prompt);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert("Copied to clipboard!");
    });
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-gray-900">
      <div className="py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-300 disabled:opacity-50">
        <Link href="/" className="">
          Back
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-8 text-indigo-400">
        AI-Powered Job Application Email Generator
      </h1>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl space-y-6 bg-gray-800 p-8 rounded-xl shadow-lg"
      >
        <label className="block">
          <span className="font-medium text-gray-300">Your Name:</span>
          <input
            type="text"
            placeholder="e.g., John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full p-3 mt-2 border border-gray-500 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>

        <label className="block">
          <span className="font-medium text-gray-300">Your Profession:</span>
          <input
            type="text"
            placeholder="e.g., Software Engineer"
            value={profession}
            onChange={(e) => setProfession(e.target.value)}
            required
            className="w-full p-3 mt-2 border border-gray-500 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>

        <label className="block">
          <span className="font-medium text-gray-300">Your Skills:</span>
          <input
            type="text"
            placeholder="e.g., React, Next.js, Tailwind CSS"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            required
            className="w-full p-3 mt-2 border border-gray-500 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>

        <label className="block">
          <span className="font-medium text-gray-300">
            Job Role You're Applying For:
          </span>
          <input
            type="text"
            placeholder="e.g., Frontend Developer"
            value={jobRole}
            onChange={(e) => setJobRole(e.target.value)}
            required
            className="w-full p-3 mt-2 border border-gray-500 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>

        <label className="block">
          <span className="font-medium text-gray-300">Company Name:</span>
          <input
            type="text"
            placeholder="e.g., Google"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            required
            className="w-full p-3 mt-2 border border-gray-500 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-300 disabled:opacity-50"
        >
          {isLoading ? "Generating..." : "Generate Email"}
        </button>
      </form>

      {emailData && (
        <div className="mt-8 w-full max-w-2xl p-6 bg-gray-800 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-indigo-400 mb-4">
            Generated Email:
          </h2>
          <div className="space-y-4">
            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-300">Subject:</span>
                <button
                  onClick={() => copyToClipboard(subject)}
                  className="py-1 px-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-300"
                >
                  Copy
                </button>
              </div>
              <p className="text-gray-300 mt-2">{subject}</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-300">Email Body:</span>
                <button
                  onClick={() => copyToClipboard(body)}
                  className="py-1 px-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-300"
                >
                  Copy
                </button>
              </div>
              <p className="text-gray-300 mt-2 whitespace-pre-line">{body}</p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
