# Insight First Health 🧬

Insight First Health is an AI-powered medical assistant application designed to analyze complex blood report data. By combining user biological metrics with advanced language models, the platform provides detailed report analyses, personalized nutrition plans, and forecasts of potential future health problems.

## 🚀 Features

* **Intelligent Blood Report Analysis:** Upload blood report files to receive structured, JSON-formatted medical insights.
* **Personalized Context:** Integrates user data (age, gender, weight, height, and food preferences) to tailor health and nutrition advice.
* **Secure AI Integration:** Utilizes Supabase Edge Functions to securely communicate with advanced AI models (such as Gemini 2.5) without exposing API keys to the client.
* **Modern Interface:** Built with a responsive, fast, and accessible frontend architecture.

## 🛠️ Technology Stack

**Frontend:**
* React
* Vite
* TypeScript
* Tailwind CSS
* shadcn/ui

**Backend & Infrastructure:**
* Supabase Edge Functions (Deno)
* OpenRouter / Google Gemini API

## 💻 Local Development Setup

Follow these steps to run the application on your local machine.

### Prerequisites
* Node.js and npm installed.
* A Supabase project set up.
* API keys for your chosen AI provider (e.g., Gemini or OpenRouter).

### Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/harshitrajsrivastava2005-bot/insight-first-health.git](https://github.com/harshitrajsrivastava2005-bot/insight-first-health.git)
   cd insight-first-health
