import { HfInference } from "@huggingface/inference";

const hf = new HfInference(process.env.NEXT_PUBLIC_HUGGINGFACE_TOKEN);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { prompt } = req.body;

    const response = await hf.textGeneration({
      model: "gpt2",
      inputs: `Generate an email subject and body about: ${prompt}. 
      Format the response like this:
      Subject: [generated subject here]
      Body: [generated email body here]`,
      parameters: {
        max_new_tokens: 200,
        return_full_text: false,
      },
    });

    const generatedText = response.generated_text;
    const subject = generatedText.match(/Subject: (.*)/)?.[1] || "";
    const body = generatedText.match(/Body: (.*)/s)?.[1] || "";

    res.status(200).json({ subject, body });
  } catch (error) {
    console.error("AI generation error:", error);
    res.status(500).json({ error: "Failed to generate content" });
  }
}
