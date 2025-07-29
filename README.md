
# AI Meeting Summarizer 🎙️📝

An intelligent web application that transcribes, summarizes, and translates meeting recordings using AI technologies.

## 🌟 Live Demo

Experience the app live:  
👉 [https://huggingface.co/spaces/ThaboMarvin/Ai-Meeting-summarizer](https://huggingface.co/spaces/ThaboMarvin/Ai-Meeting-summarizer)

## ✨ Features

- **Audio Transcription**: Convert speech to text with high accuracy
- **AI Summarization**: Get concise meeting summaries with key points
- **Multi-language Translation**: Translate summaries to various languages
- **Recording History**: Save and revisit past meetings
- **Two Input Methods**:
  - Upload existing audio files (MP3/WAV)
  - Record directly in the browser
- **Responsive Design**: Works on desktop and mobile devices

## 🛠️ Technologies Used

| Component          | Technology |
|--------------------|------------|
| Backend Framework  | Flask      |
| Frontend           | HTML5, CSS3, JavaScript |
| Speech-to-Text     | Hugging Face Whisper API |
| Text Summarization | Mistral-7B via OpenRouter |
| Translation        | Mistral-7B via OpenRouter |
| Deployment         | Hugging Face Spaces (Docker) |

## 📦 Installation (Local Development)

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/ai-meeting-summarizer.git
   cd ai-meeting-summarizer
   ```

2. **Set up a virtual environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**:
   Create a `.env` file with:
   ```
   OPENROUTER_API_KEY=your_api_key
   HF_API_TOKEN=your_hf_token
   ```

5. **Run the application**:
   ```bash
   python app.py
   ```

## 🚀 Deployment

This project is configured for easy deployment on Hugging Face Spaces:

1. Create a new Space with Docker SDK
2. Set these environment variables in Space settings:
   - `OPENROUTER_API_KEY`
   - `HF_API_TOKEN`
3. Push your code to the Space repository

## 📂 Project Structure

```
ai-meeting-summarizer/
├── app.py                # Main Flask application
├── requirements.txt      # Python dependencies
├── Dockerfile            # Container configuration
├── static/
│   ├── script.js         # Frontend logic
│   ├── style.css         # Styling
│   └── images/           # Static images
├── templates/
│   ├── index.html        # Main interface
│   ├── about.html        # About page
│   ├── contact.html      # Contact page
│   └── history.html      # Meeting history
└── uploads/              # Temporary audio storage
```

## 🤖 How It Works

1. **User** uploads/records meeting audio
2. **Whisper API** transcribes audio to text
3. **Mistral-7B** generates:
   - Concise summary
   - Bullet-point key takeaways
   - Translation to selected language
4. **Results** are displayed and saved to history

## 🌍 Supported Languages

| Language    | Code |
|-------------|------|
| English     | en   |
| Spanish     | es   |
| French      | fr   |
| German      | de   |
| Zulu        | zu   |
| Afrikaans   | af   |
| Chinese     | zh   |
| Japanese    | ja   |
| Arabic      | ar   |
| Hindi       | hi   |

## 📝 Usage Guide

1. **Record or Upload**:
   - Click "Start Recording" for live audio
   - Or drag-and-drop an audio file

2. **Select Language**:
   - Choose your target translation language

3. **Process**:
   - Click "Start Processing"
   - Wait for AI to analyze (typically 30-90 seconds)

4. **View Results**:
   - Full transcription
   - AI-generated summary
   - Key points
   - Translated version

5. **Save**:
   - Results are automatically saved to History
   - Download as text or audio

## 🛠️ Troubleshooting

**Common Issues**:
- **500 Errors**: Check API keys are properly set
- **Slow Processing**: Longer audio files take more time
- **Upload Failures**: Ensure files are <10MB and in supported formats

**Debugging**:
1. Check browser console (F12)
2. View application logs in Hugging Face Space
3. Test with shorter audio samples first

## 👥 Meet the Team

| Member | Role | Contribution |
|--------|------|--------------|
| Treasure Mashabane | Lead AI Architect | NLP models, summarization logic |
| Mudau Rebafenyi | Frontend Developer | UI implementation, responsive design |
| Thabo Mavundla | Backend Engineer | Flask API, audio processing |
| Ditshego Kgwadi | UX/UI Designer | Interface design, user experience |

## 📜 License

MIT License - See [LICENSE](LICENSE) for details.

## 🤝 Contributing

We welcome contributions! Please:
1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## 📬 Contact

For questions or feedback:
- Email: mavundlatm@icloud.com
- GitHub Issues: [Open New Issue](https://github.com/thabo-mavundla/ai-meeting-summarizer/issues)
```

