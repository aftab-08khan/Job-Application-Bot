export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email_description } = req.body;

    try {
      const response = await fetch("http://127.0.0.1:5000/predict-score", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email_description }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: "Error predicting email score" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
