# Pak Cik Raya AI 🤖🌙

A fun, interactive AI chatbot themed for Hari Raya Aidilfitri! Users must prove they are a "True Friend" to claim Duit Raya. Powered by Google Gemini AI.

## ✨ Features

*   **Interactive Chat:** Engage in a witty conversation with "Pak Cik Raya AI".
*   **Friendship Test:** The AI asks questions based on Owner's profile to verify friendship.
*   **Duit Raya Claim:** Successful users get a "Duit Raya Approved" message.
*   **Persistent Chat:** Conversations are saved so users can return later.
*   **Raya Atmosphere:** Beautiful animations, background music, and festive design.
*   **Model Fallback:** Automatically switches between Gemini models to ensure reliability.

## 🛠️ Tech Stack

*   **Frontend:** React, TypeScript, Tailwind CSS, Framer Motion.
*   **AI:** Google Generative AI SDK (Gemini).
*   **Backend (Option 1 - Node.js):** Express, MySQL (via `mysql2`).
*   **Backend (Option 2 - PHP):** PHP, MySQL (via PDO).
*   **Build Tool:** Vite.

## 🚀 Setup Guide

### Prerequisites

*   Node.js (v18+)
*   MySQL Database
*   Google Gemini API Key

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/pak-cik-raya-ai.git
cd pak-cik-raya-ai
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Google Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here

# Database Configuration (for Node.js backend)
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=chat_db
```

### 4. Database Setup

Create a MySQL database named `chat_db` (or whatever you set in `.env`). The application will automatically create the `user_chats` table on first run.

### 5. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

## 🌐 Deployment

### Option A: Node.js / Vercel / Docker

Build the app:
```bash
npm run build
```
Start the server:
```bash
npm start
```

### Option B: PHP Hosting (Shared Hosting)

1.  Build the frontend:
    ```bash
    npm run build
    ```
2.  Upload the contents of the `dist` folder to your `public_html`.
3.  Upload `public/api.php` to the same directory.
4.  Create the database on your hosting provider.
5.  Edit `api.php` (or use environment variables if supported) to set your database credentials.

## 📝 License

MIT License.
