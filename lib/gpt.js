// "use client";
// import { OpenAI } from "openai";

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY, // Get the API key from environment variables
// });

// export const correctText = async (text) => {
//   try {
//     // Use gpt-3.5-turbo instead of gpt-4
//     const response = await openai.chat.completions.create({
//       model: "gpt-3.5-turbo", // Free model
//       messages: [{ role: "user", content: text }],
//     });

//     // Return the corrected text
//     return response.choices[0].message.content;
//   } catch (error) {
//     console.error("Error correcting text:", error);
//   }
// };
