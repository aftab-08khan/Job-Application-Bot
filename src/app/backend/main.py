from flask import Flask, request, jsonify
import speech_recognition as sr

app = Flask(__name__)

@app.route("/speech-to-text", methods=["POST"])
def speech_to_text():
    recognizer = sr.Recognizer()
    audio_file = request.files["audio"]

    with sr.AudioFile(audio_file) as source:
        audio = recognizer.record(source)

    try:
        text = recognizer.recognize_google(audio)
        return jsonify({"text": text})
    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == "__main__":
    app.run(debug=True, port=5000)
