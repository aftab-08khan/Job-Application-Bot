// // "use client";
// import { NextResponse } from "next/server";
// import fs from "fs";
// import path from "path";
// import pdfParse from "pdf-parse";

// const uploadDir = path.join(process.cwd(), "public/uploads");

// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// export async function POST(req) {
//   try {
//     const data = await req.formData();
//     const file = data.get("resume");

//     if (!file) {
//       return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
//     }

//     const bytes = await file.arrayBuffer();
//     const buffer = Buffer.from(bytes);

//     const filePath = path.join(uploadDir, file.name);
//     fs.writeFileSync(filePath, buffer);

//     const parsedData = await pdfParse(buffer);

//     const extractedInfo = extractResumeDetails(parsedData.text);

//     return NextResponse.json({ success: true, data: extractedInfo });
//   } catch (error) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

// function extractResumeDetails(text) {
//   const nameMatch = text.match(/Name:\s*(.*)/i);
//   const skillsMatch = text.match(/Skills:\s*(.*)/i);
//   const experienceMatch = text.match(/Experience:\s*([\s\S]*?)Education:/i);

//   return {
//     name: nameMatch ? nameMatch[1] : "N/A",
//     skills: skillsMatch ? skillsMatch[1].split(",") : [],
//     experience: experienceMatch ? experienceMatch[1] : "N/A",
//   };
// }
