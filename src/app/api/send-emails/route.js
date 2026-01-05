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
      roles.push(role || "Job Application");
    }
  });

  return { emails, roles };
};

const parseCSV = async (file) => {
  const reader = file.stream().getReader();
  const decoder = new TextDecoder("utf-8");
  let csvData = "";

  let done = false;
  while (!done) {
    const result = await reader.read();
    done = result.done;
    if (result.value) {
      csvData += decoder.decode(result.value, { stream: !done });
    }
  }

  return parseCsvString(csvData);
};

export async function POST(req) {
  try {
    const formData = await req.formData();

    const userEmail = formData.get("senderEmail");
    const userPassword = formData.get("appPassword");
    const description = formData.get("description");
    const csvFile = formData.get("csvFile");
    const cvFile = formData.get("cvFile");
    const subject = formData.get("subject");

    /* =======================
       Validations
    ======================= */

    if (!userEmail || !userPassword) {
      return new Response("Email and App Password are required.", {
        status: 400,
      });
    }

    if (!csvFile) {
      return new Response("CSV file is required.", { status: 400 });
    }

    if (!cvFile) {
      return new Response("CV file is required.", { status: 400 });
    }

    const allowedCVTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedCVTypes.includes(cvFile.type)) {
      return new Response("Invalid CV file type.", { status: 400 });
    }

    /* =======================
       Parse CSV
    ======================= */

    const { emails, roles } = await parseCSV(csvFile);

    if (!emails.length) {
      return new Response("No valid emails found in CSV.", {
        status: 400,
      });
    }

    /* =======================
       Prepare CV Attachment
    ======================= */

    const cvBuffer = Buffer.from(await cvFile.arrayBuffer());

    /* =======================
       Nodemailer Setup
    ======================= */

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: userEmail,
        pass: userPassword,
      },
    });

    /* =======================
       Send Emails
    ======================= */

    await Promise.all(
      emails.map(async (email, index) => {
        try {
          await transporter.sendMail({
            from: userEmail,
            to: email,
            subject: subject || ` ${roles[index]}`,
            text: description,
            attachments: [
              {
                filename: cvFile.name,
                content: cvBuffer,
                contentType: cvFile.type,
              },
            ],
          });

          console.log(`Email sent to: ${email}`);
        } catch (err) {
          console.error(`Failed to send email to ${email}`, err.message);
        }
      })
    );

    return new Response("Emails sent successfully!", { status: 200 });
  } catch (error) {
    console.error("Server Error:", error);
    return new Response("Error sending emails.", { status: 500 });
  }
}
