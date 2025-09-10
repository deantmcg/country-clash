export const STYLES = {
  screenContainer: {
    menu: "min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4",
    game: "min-h-screen bg-gradient-to-br from-green-900 via-teal-900 to-cyan-900 flex items-center justify-center p-4",
    gameOver: "min-h-screen bg-gradient-to-br from-red-900 via-purple-900 to-pink-900 flex items-center justify-center p-4"
  },
  card: "bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl",
  input: "w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400",
  button: {
    primary: "w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-xl transform hover:scale-105 transition-all shadow-lg",
    secondary: "w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl transform hover:scale-105 transition-all shadow-lg",
    skip: "aspect-square h-[58px] bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transform hover:scale-105 transition-all shadow-lg flex items-center justify-center text-2xl"
  },
  feedback: {
    correct: "bg-green-500/30 border-green-400 text-green-100",
    incorrect: "bg-red-500/30 border-red-400 text-red-100"
  }
};
