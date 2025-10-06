# Grammar Study Buddy

A Nuxt 3 application that provides instant grammar feedback on your sentences using AI.

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
# Copy the example file
cp .env.example .env
```

Then edit the `.env` file and add your OpenRouter API key:

```
OPENROUTER_API_KEY=your-actual-api-key-here
```

You can get a free API key from [OpenRouter](https://openrouter.ai/keys).

### 3. Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Building for Production

```bash
# Build the application
npm run build

# Preview the production build
npm run preview
```

## Features

- ✅ Real-time grammar checking
- 🔒 Secure API key storage (server-side only)
- 🎨 Beautiful, responsive UI with Tailwind CSS
- 📝 Detailed feedback and suggestions
- 🚀 Built with Nuxt 3 and Vue 3

## Project Structure

```
.
├── pages/
│   └── index.vue           # Main page component
├── server/
│   └── api/
│       └── check-grammar.post.ts  # Server API route
├── nuxt.config.ts          # Nuxt configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── package.json            # Dependencies
└── .env                    # Environment variables (create this)
```

## How It Works

1. User enters a sentence in the frontend
2. Frontend sends the sentence to the Nuxt server API route
3. Server API route uses the OpenRouter API key (stored securely in env) to call the AI service
4. AI analyzes the grammar and returns feedback
5. Server returns the results to the frontend
6. Frontend displays the results in a beautiful UI

## Tech Stack

- **Nuxt 3** - The Vue framework for modern web applications
- **Vue 3** - Progressive JavaScript framework
- **Tailwind CSS** - Utility-first CSS framework
- **TypeScript** - Type-safe JavaScript
- **OpenRouter API** - AI-powered grammar checking

