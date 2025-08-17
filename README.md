# WriteRight - AI Grammar Correction Tool

WriteRight is a lightweight desktop application that helps you correct grammatical errors and improve text readability with a simple keyboard shortcut. Powered by Google's Gemini AI, WriteRight integrates seamlessly with any application where you write.


## Download

Download the latest version for your platform:

- **Windows**: [Download WriteRight for Windows](https://github.com/Sahilll94/WriteRight/releases/download/v1.4.2/WriteRight-Setup-1.0.0.exe)
- **macOS**: [Download WriteRight for macOS](https://github.com/Sahilll94/WriteRight/releases/download/v1.4.2/WriteRight-1.0.0-arm64.dmg)
- **Linux**: [Download WriteRight for Linux](https://github.com/Sahilll94/WriteRight/releases/download/v1.4.2/WriteRight-1.0.0.AppImage)

Or visit our [releases page](https://github.com/Sahilll94/WriteRight/releases) for all available versions.


## How It Works

1. **Install WriteRight** - Download and install the application for your platform
2. **Set Up Once** - Enter your Gemini API key when prompted (only needed once)
3. **Use Anywhere** - WriteRight runs in the background, ready when you need it

## Using WriteRight

Using WriteRight is incredibly simple:

1. **Select & Copy** - Select text you want to correct and copy it (Ctrl+C)
2. **Process** - Press the keyboard shortcut (Ctrl+A+L)
3. **Paste** - Paste the corrected text (Ctrl+V) wherever you need it

That's it! No complex interfaces, no switching between applications - just seamless grammar correction when you need it.

## Getting a Gemini API Key

WriteRight requires a Gemini API key to function. Here's how to get one:

1. Visit [Google AI Studio](https://aistudio.google.com/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the key and enter it in WriteRight when prompted

Your API key is stored securely on your device and never sent anywhere except to Google's Gemini API service for text processing.

## Features

- **Instant Grammar Correction** - Fix grammar errors with a keyboard shortcut
- **Improved Readability** - AI suggests better phrasing and clearer text
- **Minimal Interface** - Set up once, then it stays out of your way
- **Works Everywhere** - Use in emails, documents, social media posts, code comments, etc.
- **Cross-Platform** - Available for Windows, macOS, and Linux
- **Privacy-Focused** - Your API key and text corrections stay on your device

## System Requirements

- Windows 10/11, macOS 10.13+, or Linux
- 100MB disk space
- Internet connection for API calls
- Gemini API key

## Troubleshooting

- **Shortcut not working?** Make sure WriteRight is running in the background
- **Text not being processed?** Ensure you've copied text to the clipboard first (Ctrl+C)
- **API key issues?** Open WriteRight to check your API key settings

## For Developers

This project is open source. If you want to build from source:

```bash
# Clone the repository
git clone https://github.com/username/WriteRight.git

# Install dependencies
npm install

# Run in development mode
npm start

# Build for your platform
npm run build:win    # For Windows
npm run build:mac    # For macOS
npm run build:linux  # For Linux
npm run build:all    # For all platforms
```

## Technology Stack

- Electron.js
- Google Generative AI API (Gemini 2.5 Flash)

