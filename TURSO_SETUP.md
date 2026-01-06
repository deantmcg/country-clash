# Turso Database Setup Guide

This guide will help you set up and configure Turso for the Country Clash game.

## Prerequisites

- A Turso account (free tier available at https://turso.tech/)
- A Vercel account for deploying serverless functions (optional for local testing)
- Node.js installed on your machine

## Step 1: Create Turso Database

1. **Sign up for Turso** at https://turso.tech/
   - Free tier includes 8GB storage and 500 databases

2. **Install Turso CLI** (optional but recommended):
   ```bash
   curl -sSfL https://get.tur.so/install.sh | bash
   ```

3. **Authenticate with Turso**:
   ```bash
   turso auth login
   ```

4. **Create a new database**:
   ```bash
   turso db create country-clash
   ```

5. **Initialize the schema**:
   ```bash
   turso db shell country-clash < schema.sql
   ```
   
   Alternatively, you can use the Turso web console to execute the SQL from `schema.sql`.

## Step 2: Get Database Credentials

1. **Get your database URL**:
   ```bash
   turso db show country-clash --url
   ```
   This will output something like: `libsql://country-clash-your-org.turso.io`

2. **Generate an authentication token**:
   ```bash
   turso db tokens create country-clash
   ```
   Copy the token that's generated - you'll need it for configuration.

## Step 3: Configure Environment Variables

### For Local Development

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your Turso credentials:
   ```
   TURSO_DATABASE_URL=libsql://your-database-name.turso.io
   TURSO_AUTH_TOKEN=your-auth-token-here
   REACT_APP_API_URL=/api
   ```

### For Vercel Deployment

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Link your project to Vercel:
   ```bash
   vercel link
   ```

3. Add environment variables:
   ```bash
   vercel env add TURSO_DATABASE_URL
   vercel env add TURSO_AUTH_TOKEN
   ```
   
   Or set them in the Vercel dashboard:
   - Go to your project settings
   - Navigate to Environment Variables
   - Add both variables for Production, Preview, and Development

## Step 4: Test Locally

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run with Vercel Dev** (to test serverless functions):
   ```bash
   vercel dev
   ```
   
   This starts the app at http://localhost:3000 with working API endpoints.

3. **Or run just the React app** (API calls will fail, fallback to localStorage):
   ```bash
   npm start
   ```

## Step 5: Deploy to Production

### Option 1: Deploy to Vercel (Recommended)

1. **Deploy to production**:
   ```bash
   vercel --prod
   ```

2. **Verify deployment**:
   - Visit your Vercel URL
   - Play a game and submit a score
   - Check Turso dashboard to see if data was saved

### Option 2: Deploy to Other Platforms

If you're deploying to another platform (Netlify, AWS, etc.), you'll need to:
1. Adapt the serverless functions to your platform's format
2. Set environment variables in your platform's settings
3. Update the `REACT_APP_API_URL` to point to your API endpoint

## Verifying the Setup

1. **Check database connection**:
   ```bash
   turso db shell country-clash
   ```
   Then run:
   ```sql
   SELECT COUNT(*) FROM high_scores;
   ```

2. **Test the API endpoints**:
   
   Get high scores:
   ```bash
   curl https://your-app.vercel.app/api/get-high-scores
   ```
   
   Save a test score:
   ```bash
   curl -X POST https://your-app.vercel.app/api/save-high-score \
     -H "Content-Type: application/json" \
     -d '{"playerName":"Test","score":100,"questionsAnswered":10}'
   ```

## Troubleshooting

### "Missing Turso credentials" error
- Verify environment variables are set correctly
- For Vercel, ensure variables are added to all environments (Production, Preview, Development)
- Restart the development server after adding environment variables

### API calls failing
- Check browser console for CORS errors
- Verify the API URL is correct in `.env`
- Check Vercel function logs for errors

### Database connection timeout
- Verify your Turso token is valid (tokens expire)
- Check if your database is active: `turso db show country-clash`
- Regenerate token if needed: `turso db tokens create country-clash`

### Data not persisting
- Check Vercel function logs for errors
- Verify the database schema was created correctly
- Test the API endpoints directly using curl or Postman

## Database Maintenance

### View high scores:
```bash
turso db shell country-clash
```
```sql
SELECT * FROM high_scores ORDER BY score DESC LIMIT 10;
```

### View game sessions:
```sql
SELECT * FROM game_sessions ORDER BY ended_at DESC LIMIT 10;
```

### Clear all data (if needed):
```sql
DELETE FROM answer_log;
DELETE FROM game_sessions;
DELETE FROM high_scores;
```

## Cost Considerations

Turso free tier includes:
- 8GB total storage
- 500 databases
- 1 billion row reads per month
- 5 million row writes per month

This is more than sufficient for a typical quiz game with thousands of players.

## Support

- Turso Documentation: https://docs.turso.tech/
- Vercel Documentation: https://vercel.com/docs
- Turso Discord: https://discord.gg/turso
