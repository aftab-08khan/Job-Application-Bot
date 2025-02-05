import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const body = await req.formData();
    const userEmail = body.get("senderEmail");
    const userPassword = body.get("appPassword");
    const description = body.get("description");
    const file = body.get("csvFile");
    const subject = body.get("subject");

    if (!userEmail || !userPassword) {
      return new Response("Email and password are required.", { status: 400 });
    }

    if (!file) {
      return new Response("No file uploaded.", { status: 400 });
    }

    const emails = await parseCSV(file);

    if (!emails.length) {
      return new Response("No valid emails found in CSV.", { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: userEmail,
        pass: userPassword,
      },
    });

    for (let email of emails) {
      try {
        await transporter.sendMail({
          from: userEmail,
          to: email,
          subject: subject,
          text: description,
        });
        console.log(`Email sent to: ${email}`);
      } catch (err) {
        console.error(`Failed to send email to ${email}:`, err.message);
      }
    }

    return new Response("Emails sent successfully!", { status: 200 });
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response("Error sending emails.", { status: 500 });
  }
}

const parseCSV = async (file) => {
  const reader = file.stream().getReader();
  const decoder = new TextDecoder("utf-8");
  let csvData = "";
  let emails = [];

  try {
    let { value, done } = await reader.read();
    while (!done) {
      csvData += decoder.decode(value, { stream: true });
      ({ value, done } = await reader.read());
    }

    emails = parseCsvString(csvData);
  } catch (error) {
    console.error("Error reading CSV file:", error);
  }

  return emails;
};

const parseCsvString = (csvData) => {
  const emails = [];
  const lines = csvData.split("\n");

  lines.forEach((line, index) => {
    if (index === 0) return;

    const columns = line.split(",").map((col) => col.trim());
    const email = columns[0];

    if (email && isValidEmail(email)) {
      emails.push(email);
    }
  });

  return emails;
};

const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
