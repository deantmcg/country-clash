# Capital Cities Quiz Game 🌍

A React-based quiz game that tests your knowledge of countries and their capital cities. This is a modern web version of the original C# WinForms Capital Cities Game.

## Features

- **Progressive Difficulty**: Game starts easy and gets harder every 5 correct answers
- **Lives System**: 3 lives to keep you engaged
- **Dynamic Scoring**: Points scale with difficulty (10/20/30 points)
- **High Score Tracking**: Persistent leaderboard with top 10 scores
- **Modern UI**: Beautiful gradients and glassmorphism effects
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
- **Local Storage** - For persistent high scores
- **Create React App** - Build tooling

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