import nodemailer from "nodemailer";
import csv from "csv-parser";

export async function POST(req) {
  try {
    const body = await req.formData();
    const description = body.get("description");
    const file = body.get("csvFile");
    const subject = body.get("subject");
    const emails = await parseCSV(file);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    for (let email of emails) {
      console.log(email, "email");

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: subject,
        text: description,
      };

      await transporter.sendMail(mailOptions);
    }

    return new Response("Emails sent successfully!", { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Error sending emails.", { status: 500 });
  }
}

const parseCSV = (file) => {
  return new Promise((resolve, reject) => {
    const emails = [];
    const reader = file.stream().getReader();
    const decoder = new TextDecoder("utf-8");
    let chunks = "";

    reader
      .read()
      .then(function processText({ done, value }) {
        if (done) {
          parseCsvString(chunks, emails);
          return resolve(emails);
        }

        chunks += decoder.decode(value, { stream: true });
        reader.read().then(processText);
      })
      .catch(reject);
  });
};

const parseCsvString = (csvData, emails) => {
  const lines = csvData.split("\n");
  lines.forEach((line, index) => {
    if (index === 0) return; // Skip header row
    const columns = line.split(",");
    const email = columns[0].trim(); // Assuming email is in the first column
    if (email) {
      emails.push(email);
    }
  });
};
