# Supabase Setup Guide

This guide will help you set up Supabase for your Grammar Study Buddy application to save and load grammar check history.

## Prerequisites

- A Supabase account (sign up at [https://supabase.com](https://supabase.com))

## Step-by-Step Setup

### 1. Create a New Supabase Project

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Click on "New Project"
3. Fill in the project details:
   - **Name**: Grammar Study Buddy (or any name you prefer)
   - **Database Password**: Choose a strong password
   - **Region**: Select the region closest to your users
4. Click "Create new project" and wait for the project to be set up (usually takes 1-2 minutes)

### 2. Create the Database Table

1. In your Supabase project dashboard, go to the **SQL Editor** (in the left sidebar)
2. Click on "New query"
3. Copy the contents of the `supabase-schema.sql` file and paste it into the SQL editor
4. Click "Run" to execute the SQL script

This will create the `grammar_history` table with the following structure:
- `id`: Unique identifier (auto-generated)
- `sentence`: The original sentence submitted by the user
- `is_correct`: Whether the grammar was correct (boolean)
- `corrected_sentence`: The corrected version (if applicable)
- `feedback`: Detailed feedback from the AI
- `suggestions`: Array of suggestions for improvement
- `created_at`: Timestamp of when the entry was created

### 3. Get Your API Credentials

1. Go to **Settings** > **API** in your Supabase project dashboard
2. You'll find two important values:
   - **Project URL**: This is your `SUPABASE_URL`
   - **anon/public key**: This is your `SUPABASE_KEY`

### 4. Configure Environment Variables

1. Create a `.env` file in the root of your project (if it doesn't exist already)
2. Add the following variables:

```env
# OpenRouter API Key
OPENROUTER_API_KEY=your_openrouter_api_key_here

# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
```

3. Replace the placeholder values with your actual credentials:
   - `SUPABASE_URL`: Paste your Project URL from step 3
   - `SUPABASE_KEY`: Paste your anon/public key from step 3

### 5. Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Open the application in your browser (usually `http://localhost:3000`)

3. Try checking a sentence:
   - Enter a sentence
   - Click "Check Grammar"
   - The result should appear, and it should be saved to your Supabase database

4. Verify in Supabase:
   - Go to **Table Editor** in your Supabase dashboard
   - Select the `grammar_history` table
   - You should see your entry there!

5. Refresh the page:
   - The history panel should load your previous checks from Supabase

## Optional: Enable Row Level Security (RLS)

If you plan to add user authentication in the future, you can enable Row Level Security:

1. Go to **Table Editor** > `grammar_history` table
2. Click on "RLS disabled" to enable it
3. Create policies to control who can read/write data

For now, the table is publicly accessible (anyone with your API key can read/write), which is fine for development but should be secured for production.

## Troubleshooting

### Error: "Failed to save history"

- Check that your `SUPABASE_URL` and `SUPABASE_KEY` are correctly set in the `.env` file
- Verify that the `grammar_history` table exists in your Supabase database
- Check the browser console and server logs for more detailed error messages

### Error: "Supabase credentials are not configured"

- Make sure you've created the `.env` file
- Restart your development server after adding environment variables
- Ensure the variable names match exactly: `SUPABASE_URL` and `SUPABASE_KEY`

### History not loading

- Check the browser console for errors
- Verify that data exists in the `grammar_history` table in Supabase
- Make sure your API key has read permissions

## Production Deployment

When deploying to production:

1. Add your environment variables to your hosting platform (Vercel, Netlify, etc.)
2. Consider enabling Row Level Security and adding authentication
3. Monitor your Supabase usage to ensure you stay within your plan limits
4. Consider adding indexes for better performance as your data grows

## Features Enabled

With Supabase integration, your app now:

- ✅ Saves every grammar check to a persistent database
- ✅ Loads history automatically when the page loads
- ✅ Maintains history across sessions and devices
- ✅ Allows you to view your entire grammar checking history

Enjoy your Grammar Study Buddy with persistent history! 🎉

