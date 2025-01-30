"use client";

import { useState, useEffect } from "react";
import { useTheme } from "../../context/themeContext";
import { styled } from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import { Typography } from "@mui/material";

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  "& .MuiSwitch-switchBase": {
    margin: 1,
    padding: 0,
    transform: "translateX(6px)",
    "&.Mui-checked": {
      color: "#fff",
      transform: "translateX(22px)",
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: "#aab4be",
      },
    },
  },
  "& .MuiSwitch-thumb": {
    backgroundColor: "#001e3c",
    width: 32,
    height: 32,
  },
  "& .MuiSwitch-track": {
    opacity: 1,
    backgroundColor: "#aab4be",
    borderRadius: 20 / 2,
  },
}));

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
    <div className="w-full p-6 min-h-screen bg-gray-900 transition duration-300">
      <div className="w-full bg-gray-800 bg-opacity-60 p-6 rounded-2xl shadow-xl border border-gray-700 backdrop-blur-md transition-all duration-500 animate-fadeIn">
        <h1 className="text-3xl font-semibold text-center mb-6 text-indigo-400">
          Send Emails
        </h1>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="flex flex-row gap-6">
            <div className="flex-1">
              <label
                htmlFor="csvFile"
                className="block text-lg font-medium text-gray-300"
              >
                Upload CSV
              </label>
              <input
                type="file"
                id="csvFile"
                accept=".csv"
                onChange={handleFileChange}
                className="mt-2 w-full border p-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300 bg-gray-700 text-white border-gray-600"
              />
            </div>

            <div className="flex-1">
              <label
                htmlFor="subject"
                className="block text-lg font-medium text-gray-300"
              >
                Subject
              </label>
              <input
                type="text"
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="mt-2 w-full border p-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300 bg-gray-700 text-white border-gray-600"
                placeholder="Enter subject"
              />
            </div>
          </div>

          <div>
            <div>
              <label
                htmlFor="description"
                className="block text-lg font-medium text-gray-300"
              >
                Description
              </label>
              {isSpeechRecognitionAvailable && (
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={startSpeechRecognition}
                    className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-md"
                  >
                    Start Speaking
                  </button>
                </div>
              )}
            </div>

            <textarea
              id="description"
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-2 w-full border p-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300 bg-gray-700 text-white border-gray-600"
              placeholder="Enter description"
            ></textarea>
          </div>

          {errorMessage && (
            <div className="text-red-500 text-center">{errorMessage}</div>
          )}
          {successMessage && (
            <div className="text-green-500 text-center">{successMessage}</div>
          )}

          <button
            type="submit"
            className="mt-6 p-3 w-full bg-indigo-700 text-white rounded-md"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Emails"}
          </button>
        </form>
      </div>
    </div>
  );
}
