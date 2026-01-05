# Country Clash 🌍

A React-based quiz game that tests your knowledge of countries and their capital cities. This is a modern web version of the original C# WinForms Capital Cities Game I created in one of my first software development modules.

## Features

- **Progressive Difficulty**: Game starts easy and gets harder every 5 correct answers
- **Lives System**: 3 lives to keep you engaged
- **Dynamic Scoring**: Points scale with difficulty (10/20/30 points)
- **High Score Tracking**: Persistent leaderboard with top 10 scores
- **Modern UI**: Nice gradients and glassmorphism effects
- **Responsive Design**: Works on desktop and mobile devices
- **Keyboard Support**: Press Enter to submit answers

## Game Mechanics

- **Level 1 (Easy)**: Common capitals like Paris, London, Tokyo (10 points each)
- **Level 2 (Medium)**: Trickier ones like Canberra, Ottawa, Bern (20 points each)  
- **Level 3 (Hard)**: Challenging capitals like Naypyidaw, Ngerulmud (30 points each)

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone or download the project files
2. Navigate to the project directory:
   ```bash
   cd capital-cities-game
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm start
   ```

5. Open your browser and go to `http://localhost:3000`

### Building for Production

To create a production build:

```bash
npm run build
```

The build files will be in the `build/` directory, ready to deploy to any web server.

### Deploying to GitHub Pages

Deploy to GitHub Pages:

```bash
npm run deploy
```

This will build and publish the game to: `https://deantmcg.github.io/country-clash`

**First-time setup**: After deploying, enable GitHub Pages in your repository settings (Settings → Pages → Source: `gh-pages` branch).


## Project Structure

```
capital-cities-game/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/
│   │   └── CapitalCitiesGame.js
│   ├── App.js
│   ├── index.js
│   └── index.css
├── package.json
├── tailwind.config.js
└── postcss.config.js
```

## Technologies Used

- **React 18** - Frontend framework
- **Tailwind CSS** - Utility-first CSS framework
- **Turso** - Cloud SQLite database for persistent high scores and game data
- **Vercel Serverless Functions** - Backend API endpoints
- **Create React App** - Build tooling

## Database Setup (Turso)

This application uses [Turso](https://turso.tech/), a free and easy-to-deploy cloud SQLite database for persistent storage of high scores and game sessions.

### Setting Up Turso

1. **Create a Turso account** at [https://turso.tech/](https://turso.tech/)

2. **Install the Turso CLI** (optional but recommended):
   ```bash
   curl -sSfL https://get.tur.so/install.sh | bash
   ```

3. **Create a new database**:
   ```bash
   turso db create country-clash
   ```

4. **Get your database URL**:
   ```bash
   turso db show country-clash --url
   ```

5. **Generate an authentication token**:
   ```bash
   turso db tokens create country-clash
   ```

6. **Initialize the database schema**:
   The database schema includes three tables:
   - `high_scores` - Stores player scores from completed games
   - `game_sessions` - Detailed information about individual game sessions
   - `answer_log` - Individual question/answer records

   Use the Turso CLI to execute the schema:
   ```bash
   turso db shell country-clash < schema.sql
   ```

   Or use the Turso web dashboard to run the SQL schema provided in the issue.

### Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your Turso credentials:
   ```
   TURSO_DATABASE_URL=libsql://your-database-name.turso.io
   TURSO_AUTH_TOKEN=your-auth-token-here
   REACT_APP_API_URL=/api
   ```

### Deploying to Vercel

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Deploy to Vercel**:
   ```bash
   vercel
   ```

3. **Set environment variables in Vercel**:
   ```bash
   vercel env add TURSO_DATABASE_URL
   vercel env add TURSO_AUTH_TOKEN
   ```

   Or set them in the Vercel dashboard under Project Settings → Environment Variables.

4. **Deploy to production**:
   ```bash
   vercel --prod
   ```

### Local Development with Backend

To test the serverless functions locally:

1. Install Vercel CLI (if not already installed)
2. Run the development server:
   ```bash
   vercel dev
   ```

This will start both the React app and the serverless functions locally.

## API Endpoints

The application includes the following API endpoints:

- `GET /api/get-high-scores` - Fetch top 10 high scores
- `POST /api/save-high-score` - Save a new high score
- `POST /api/save-game-session` - Save complete game session details
- `POST /api/save-answer-logs` - Save individual answer logs

All endpoints handle CORS and include appropriate error handling.

## Offline/Fallback Mode

The application includes a fallback mechanism to localStorage if the Turso database is unavailable. This ensures the game remains playable even if there are network issues or database connectivity problems. When the database becomes available again, the application will resume using it for persistent storage.

## Game Data

The game includes 22 countries across 3 difficulty levels:

- **Easy**: France, Germany, Italy, Spain, UK, Japan
- **Medium**: Australia, Brazil, Canada, India, South Africa, Netherlands, Switzerland, Turkey
- **Hard**: Kazakhstan, Myanmar, Sri Lanka, Côte d'Ivoire, Palau, Benin, Bolivia, Montenegro

## Contributing

Feel free to fork this project and add more countries, improve the UI, or add new features like:

- Sound effects
- More difficulty levels  
- Multiplayer support
- Country flags as hints
- Timed questions

## License

This project is open source and available under the MIT License.

## Acknowledgments

Based on the original C# WinForms Capital Cities Game, reimagined for the modern web with React and contemporary design patterns.