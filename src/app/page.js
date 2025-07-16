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
  const { handleMode, mode } = useTheme();
  const [senderEmail, setSenderEmail] = useState("");
  const [appPassword, setAppPassword] = useState("");

  const [isSpeechRecognitionAvailable, setIsSpeechRecognitionAvailable] =
    useState(false);
  const [recognitionInstance, setRecognitionInstance] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (
        "SpeechRecognition" in window ||
        "webkitSpeechRecognition" in window
      ) {
        setIsSpeechRecognitionAvailable(true);
      }
    }
  }, []);

  const handleFileChange = (e) => {
    setCsvFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!csvFile || !description || !subject || !senderEmail || !appPassword) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    const formData = new FormData();
    formData.append("csvFile", csvFile);
    formData.append("description", description);
    formData.append("subject", subject);
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
    <div className="w-full p-4 min-h-screen bg-gray-900 transition duration-300 flex items-center justify-center">
      <div className="w-full max-w-4xl bg-gray-800 bg-opacity-60 p-6 rounded-2xl shadow-xl border border-gray-700 backdrop-blur-md transition-all duration-500 animate-fadeIn">
        <h1 className="text-4xl font-bold text-center mb-8 text-indigo-400">
          Send Emails
        </h1>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <label
                htmlFor="senderEmail"
                className="block text-lg font-medium text-gray-300 mb-2"
              >
                Sender Email
              </label>
              <input
                type="email"
                id="senderEmail"
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
                className="mt-2 w-full border p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300 bg-gray-700 text-white border-gray-600 hover:border-indigo-500"
                placeholder="Enter sender email"
              />
            </div>

            <div className="flex-1">
              <label
                htmlFor="appPassword"
                className="block text-lg font-medium text-gray-300 mb-2"
              >
                Email App Password
              </label>
              <input
                type="password"
                id="appPassword"
                value={appPassword}
                onChange={(e) => setAppPassword(e.target.value)}
                className="mt-2 w-full border p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300 bg-gray-700 text-white border-gray-600 hover:border-indigo-500"
                placeholder="Enter Email app password"
              />
              <p className="mt-2 text-sm text-gray-400">
                To generate an app password:
                <ol className="list-decimal list-inside mt-1 space-y-1">
                  <li>Go to your email account's security settings.</li>
                  <li>Enable 2-Step Verification if not already enabled.</li>
                  <li>Find the section for App Passwords.</li>
                  <li>Generate a new app password and copy it.</li>
                  <li>Paste it into the field above.</li>
                </ol>
              </p>
            </div>
          </div>
          <div className="flex-1">
            <label
              htmlFor="csvFile"
              className="block text-lg font-medium text-gray-300 mb-2"
            >
              Upload CSV
            </label>
            <div className="relative mt-2">
              <input
                type="file"
                id="csvFile"
                accept=".csv"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="w-full p-4 rounded-lg border-2 border-dashed border-gray-600 bg-gray-700 hover:border-indigo-500 transition duration-300 flex items-center justify-center">
                <div className="text-center">
                  <svg
                    className="w-8 h-8 mx-auto text-indigo-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                    ></path>
                  </svg>
                  <p className="mt-2 text-sm text-gray-300">
                    <span className="font-semibold text-indigo-500">
                      Click to upload
                    </span>{" "}
                    or drag and drop
                  </p>
                  <p className="text-xs text-gray-400">CSV file only</p>
                </div>
              </div>
              {csvFile && (
                <div className="mt-2 text-sm text-gray-300">
                  Selected file:{" "}
                  <span className="font-medium text-indigo-400">
                    {csvFile.name}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div>
              <label
                htmlFor="subject"
                className="block text-lg font-medium text-gray-300 mb-2"
              >
                Subject
              </label>
              <input
                type="text"
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="mt-2 w-full border p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300 bg-gray-700 text-white border-gray-600 hover:border-indigo-500"
                placeholder="Enter subject"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-lg font-medium text-gray-300 mb-2"
              >
                Description
              </label>
              <textarea
                rows="6"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-2 w-full border p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300 bg-gray-700 text-white border-gray-600 hover:border-indigo-500"
                placeholder="Enter description"
              />
            </div>
          </div>

          <div className="flex justify-center items-center space-x-4">
            {loading ? (
              <span>Loading...</span>
            ) : (
              <button
                type="submit"
                className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300"
              >
                Send Emails
              </button>
            )}
          </div>

          {errorMessage && (
            <div className="text-red-500 text-center mt-4">{errorMessage}</div>
          )}
          {successMessage && (
            <div className="text-green-500 text-center mt-4">
              {successMessage}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
