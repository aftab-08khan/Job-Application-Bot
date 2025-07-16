import nodemailer from "nodemailer";

const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const parseCsvString = (csvString) => {
  const rows = csvString.trim().split("\n");
  const headers = rows[0].split(",");

  const emailIndex = headers.findIndex((h) =>
    h.toLowerCase().includes("email")
  );
  const roleIndex = headers.findIndex((h) => h.toLowerCase().includes("role"));

  const emails = [];
  const roles = [];

  rows.slice(1).forEach((row) => {
    const values = row.split(",");
    const email = values[emailIndex]?.trim();
    const role = values[roleIndex]?.trim();

    if (email && isValidEmail(email)) {
      emails.push(email);
      roles.push(role || "No Role");
    }
  });

  return { emails, roles };
};

const parseCSV = async (file) => {
  const reader = file.stream().getReader();
  const decoder = new TextDecoder("utf-8");
  let csvData = "";

  try {
    let { value, done } = await reader.read();
    while (!done) {
      csvData += decoder.decode(value, { stream: true });
      ({ value, done } = await reader.read());
    }

    return parseCsvString(csvData);
  } catch (error) {
    console.error("Error reading CSV file:", error);
    return { emails: [], roles: [] };
  }
};

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

    const { emails, roles } = await parseCSV(file);

    if (!emails.length || !roles.length) {
      return new Response("No valid emails or roles found in CSV.", {
        status: 400,
      });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: userEmail,
        pass: userPassword,
      },
    });

    await Promise.all(
      emails.map(async (email, i) => {
        try {
          await transporter.sendMail({
            from: userEmail,
            to: email,
            subject: subject || roles[i] || "No Subject",
            text: description,
          });
          console.log(`Email sent to: ${email}`);
        } catch (err) {
          console.error(`Failed to send email to ${email}:`, err.message);
        }
      })
    );

    return new Response("Emails sent successfully!", { status: 200 });
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response("Error sending emails.", { status: 500 });
  }
}
