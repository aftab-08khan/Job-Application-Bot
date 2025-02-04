"use client";

import { useState, useEffect } from "react";
import { useTheme } from "../../context/themeContext";
import { styled } from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import { Typography } from "@mui/material";
import Link from "next/link";

// const MaterialUISwitch = styled(Switch)(({ theme }) => ({
//   width: 62,
//   height: 34,
//   padding: 7,
//   "& .MuiSwitch-switchBase": {
//     margin: 1,
//     padding: 0,
//     transform: "translateX(6px)",
//     "&.Mui-checked": {
//       color: "#fff",
//       transform: "translateX(22px)",
//       "& + .MuiSwitch-track": {
//         opacity: 1,
//         backgroundColor: "#aab4be",
//       },
//     },
//   },
//   "& .MuiSwitch-thumb": {
//     backgroundColor: "#001e3c",
//     width: 32,
//     height: 32,
//   },
//   "& .MuiSwitch-track": {
//     opacity: 1,
//     backgroundColor: "#aab4be",
//     borderRadius: 20 / 2,
//   },
// }));

export default function Home() {
  const [csvFile, setCsvFile] = useState(null);
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const { handleMode, mode } = useTheme();

  const [isSpeechRecognitionAvailable, setIsSpeechRecognitionAvailable] =
    useState(false);

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

  const startSpeechRecognition = () => {
    if (isSpeechRecognitionAvailable) {
      const recognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new recognition();
      recognitionInstance.lang = "en-US";
      recognitionInstance.interimResults = false;

      recognitionInstance.onresult = (event) => {
        const speechToText = event.results[0][0].transcript;
        setDescription(speechToText);
      };

      recognitionInstance.start();
    } else {
      alert("Speech Recognition is not supported in your browser.");
    }
  };

  const handleFileChange = (e) => {
    setCsvFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!csvFile || !description || !subject) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    const formData = new FormData();
    formData.append("csvFile", csvFile);
    formData.append("description", description);
    formData.append("subject", subject);

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
      } else {
        setErrorMessage("Failed to send emails.");
      }
    } catch (error) {
      setErrorMessage("Error sending emails.");
    } finally {
      setLoading(false);
    }
  };
  const predictEmailScore = async (description) => {
    try {
      const response = await fetch("/api/predict-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch score");
      }

      const data = await response.json();
      return data.score;
    } catch (error) {
      console.error("Error predicting email score:", error.message);
      return null;
    }
  };

  const handleSubmitDescription = async (e) => {
    e.preventDefault();
    const emailScore = await predictEmailScore(description);
    console.log("Predicted Email Score:", emailScore);
  };
  // fetch("/api/predict-score", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ email_description: "Test email" }),
  // })
  //   .then((res) => res.json())
  //   .then(console.log)
  //   .catch(console.error);

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
          </div>

          <div className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300 w-40">
            <Link href="/ai-helper">Generate with AI</Link>
          </div>
          <div className="flex-1">
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
            <div className="flex justify-between w-full items-center mb-4">
              {isSpeechRecognitionAvailable && (
                <div className="">
                  <button
                    type="button"
                    onClick={startSpeechRecognition}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300"
                  >
                    Start Speaking
                  </button>
                </div>
              )}
            </div>
            <textarea
              id="description"
              rows="6"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-2 w-full border p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300 bg-gray-700 text-white border-gray-600 hover:border-indigo-500"
              placeholder="Enter description"
            ></textarea>
            <div className="">
              <button
                type="button"
                onClick={handleSubmitDescription}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300"
              >
                Test Description
              </button>
            </div>
          </div>

          {errorMessage && (
            <div className="text-red-500 text-center text-lg">
              {errorMessage}
            </div>
          )}
          {successMessage && (
            <div className="text-green-500 text-center text-lg">
              {successMessage}
            </div>
          )}

          <button
            type="submit"
            className="mt-6 p-3 w-full bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 mr-3 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Sending...
              </div>
            ) : (
              "Send Emails"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
