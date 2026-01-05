"use client";

import { useState, useEffect } from "react";
import { useTheme } from "../../context/themeContext";
import { Typography } from "@mui/material";
import Link from "next/link";

export default function Home() {
  const [csvFile, setCsvFile] = useState(null);
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [senderEmail, setSenderEmail] = useState("");
  const [appPassword, setAppPassword] = useState("");
  const [cvFile, setCvFile] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    setCsvFile(file);
  };

  const handleCvChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      setErrorMessage("Only PDF or Word documents are allowed.");
      return;
    }

    setCvFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!csvFile || !description || !senderEmail || !appPassword || !cvFile) {
      setErrorMessage("Please fill in all fields including CV.");
      return;
    }

    const formData = new FormData();
    formData.append("csvFile", csvFile);
    formData.append("cvFile", cvFile);
    formData.append("description", description);
    formData.append("senderEmail", senderEmail);
    formData.append("appPassword", appPassword);

    try {
      setLoading(true);
      const res = await fetch("/api/send-emails", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setSuccessMessage("Emails sent successfully!");
        setErrorMessage(null);
        setCsvFile(null);
        setDescription("");
        setSubject("");
        setSenderEmail("");
        setAppPassword("");
        setCvFile(null);
      } else {
        setErrorMessage("Failed to send emails.");
      }
    } catch (error) {
      setErrorMessage("Error sending emails.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 p-4 md:p-8 transition-all duration-500">
      {/* Header Section */}
      <div className="max-w-6xl mx-auto mb-10 md:mb-16 text-center animate-fadeIn">
        <div className="inline-flex items-center justify-center mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center mr-4 shadow-lg shadow-indigo-500/30">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              ></path>
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
            Job Application Bot
          </h1>
        </div>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Automate your job applications by sending personalized emails with
          your CV
        </p>
      </div>

      {/* Main Form Container */}
      <div className="max-w-6xl mx-auto">
        <div className="bg-gray-800/60 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/50 overflow-hidden transition-all duration-500 hover:border-gray-600/60">
          {/* Form Header */}
          <div className="px-8 pt-8 pb-6 border-b border-gray-700/50">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  Send Job Applications
                </h2>
                <p className="text-gray-400">
                  Fill in the details to start sending applications
                </p>
              </div>
              <div className="hidden md:block px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500/20 to-purple-600/20 border border-indigo-500/30">
                <span className="text-indigo-400 font-semibold">
                  Step 1 of 1
                </span>
              </div>
            </div>
          </div>

          <form className="p-8 space-y-8" onSubmit={handleSubmit}>
            {/* Credentials Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Sender Email */}
              <div className="space-y-3">
                <label
                  htmlFor="senderEmail"
                  className="flex items-center text-lg font-medium text-gray-300"
                >
                  <span className="w-2 h-2 rounded-full bg-indigo-500 mr-3"></span>
                  Sender Email
                </label>
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
                  <input
                    type="email"
                    id="senderEmail"
                    value={senderEmail}
                    onChange={(e) => setSenderEmail(e.target.value)}
                    className="relative w-full px-4 py-4 rounded-lg bg-gray-900/80 border border-gray-700/50 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 transition duration-300"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              {/* App Password */}
              <div className="space-y-3">
                <label
                  htmlFor="appPassword"
                  className="flex items-center text-lg font-medium text-gray-300"
                >
                  <span className="w-2 h-2 rounded-full bg-indigo-500 mr-3"></span>
                  Email App Password
                </label>
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
                  <input
                    type="password"
                    id="appPassword"
                    value={appPassword}
                    onChange={(e) => setAppPassword(e.target.value)}
                    className="relative w-full px-4 py-4 rounded-lg bg-gray-900/80 border border-gray-700/50 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 transition duration-300"
                    placeholder="Enter your app password"
                  />
                </div>
              </div>
            </div>

            {/* File Upload Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* CSV File Upload */}
              <div className="space-y-3">
                <label className="flex items-center text-lg font-medium text-gray-300">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 mr-3"></span>
                  Upload CSV File
                </label>
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
                  <div className="relative">
                    <input
                      type="file"
                      id="csvFile"
                      accept=".csv"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="p-6 rounded-lg bg-gray-900/80 border-2 border-dashed border-gray-700/50 hover:border-indigo-500/50 transition duration-300">
                      <div className="text-center">
                        <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 flex items-center justify-center">
                          <svg
                            className="w-7 h-7 text-indigo-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            ></path>
                          </svg>
                        </div>
                        <p className="text-gray-300 font-medium">
                          {csvFile ? csvFile.name : "Upload CSV File"}
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                          {csvFile
                            ? "Click to change file"
                            : "Click to browse or drag and drop"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CV Upload */}
              <div className="space-y-3">
                <label className="flex items-center text-lg font-medium text-gray-300">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 mr-3"></span>
                  Attach Your CV
                </label>
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
                  <div className="relative">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleCvChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="p-6 rounded-lg bg-gray-900/80 border-2 border-dashed border-gray-700/50 hover:border-indigo-500/50 transition duration-300">
                      <div className="text-center">
                        <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 flex items-center justify-center">
                          <svg
                            className="w-7 h-7 text-indigo-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            ></path>
                          </svg>
                        </div>
                        <p className="text-gray-300 font-medium">
                          {cvFile ? cvFile.name : "Upload CV (PDF/DOC)"}
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                          {cvFile
                            ? "Click to change file"
                            : "Supports .pdf, .doc, .docx"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div className="space-y-3">
              <label
                htmlFor="description"
                className="flex items-center text-lg font-medium text-gray-300"
              >
                <span className="w-2 h-2 rounded-full bg-indigo-500 mr-3"></span>
                Email Message
              </label>
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
                <textarea
                  rows="8"
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="relative w-full px-4 py-4 rounded-lg bg-gray-900/80 border border-gray-700/50 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 transition duration-300 resize-none"
                  placeholder="Write your personalized email message here..."
                />
              </div>
              <div className="flex justify-between items-center pt-2">
                <p className="text-sm text-gray-500">
                  This message will be sent to all recipients in your CSV file
                </p>
                <div className="text-sm text-gray-500">
                  {description.length} characters
                </div>
              </div>
            </div>

            {/* Help Section */}
            <div className="bg-gradient-to-r from-gray-900/80 to-gray-800/50 rounded-xl p-6 border border-gray-700/50">
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center mr-4 flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-indigo-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-300 mb-2">
                    How to Generate App Password
                  </h4>
                  <ol className="list-decimal list-inside space-y-2 text-gray-400">
                    <li>Go to your email account's security settings</li>
                    <li>Enable 2-Step Verification if not already enabled</li>
                    <li>Find the section for App Passwords</li>
                    <li>Generate a new app password and copy it</li>
                    <li>Paste it into the App Password field above</li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Submit Button and Messages */}
            <div className="pt-8 border-t border-gray-700/50">
              <div className="flex flex-col items-center space-y-6">
                <button
                  type="submit"
                  disabled={loading}
                  className={`group relative px-12 py-4 rounded-xl font-semibold text-lg tracking-wide transition-all duration-300
                    ${
                      loading
                        ? "bg-indigo-400/50 cursor-not-allowed"
                        : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg hover:shadow-indigo-500/40"
                    }`}
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl blur opacity-0 group-hover:opacity-70 transition duration-500"></div>
                  <div className="relative flex items-center justify-center gap-3">
                    {loading ? (
                      <>
                        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        <span>Sending Applications...</span>
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-5 h-5 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                          ></path>
                        </svg>
                        <span>Send Applications</span>
                      </>
                    )}
                  </div>
                </button>

                {errorMessage && (
                  <div className="w-full max-w-lg px-6 py-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-center animate-fadeIn backdrop-blur-sm">
                    <div className="flex items-center justify-center gap-3">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                      {errorMessage}
                    </div>
                  </div>
                )}

                {successMessage && (
                  <div className="w-full max-w-lg px-6 py-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-center animate-fadeIn backdrop-blur-sm">
                    <div className="flex items-center justify-center gap-3">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                      {successMessage}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>
            Make sure all information is accurate before sending applications
          </p>
        </div>
      </div>
    </div>
  );
}
