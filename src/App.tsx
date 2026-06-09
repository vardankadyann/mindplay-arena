/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, 
  Trophy, 
  RotateCcw, 
  HelpCircle, 
  SkipForward, 
  Eye, 
  CheckCircle2, 
  XCircle, 
  Timer,
  Gamepad2,
  Brain,
  Zap,
  Puzzle,
  Lightbulb,
  User,
  Settings as SettingsIcon,
  History as HistoryIcon,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  ChevronLeft,
  Calendar,
  Percent,
  Play
} from 'lucide-react';
import { 
  SCRAMBLE_WORDS, 
  RIDDLES, 
  GUESS_WORDS, 
  QUIZ_QUESTIONS, 
  shuffleArray 
} from './data.ts';
import { Riddle, GuessWord, QuizQuestion, GameState, UserStats, UserSettings, GameHistoryEntry } from './types.ts';

// --- Audio Utility ---
const playSound = (type: 'correct' | 'wrong' | 'click', enabled: boolean) => {
  if (!enabled) return;
  const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);

  if (type === 'correct') {
    osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
    osc.frequency.exponentialRampToValueAtTime(1046.50, ctx.currentTime + 0.1); // C6
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
    osc.start();
    osc.stop(ctx.currentTime + 0.2);
  } else if (type === 'wrong') {
    osc.frequency.setValueAtTime(220, ctx.currentTime); // A3
    osc.frequency.linearRampToValueAtTime(110, ctx.currentTime + 0.2); // A2
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  } else {
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.05);
    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  }
};

// --- Components ---

const Header = () => (
  <header className="py-6 px-4 bg-white dark:bg-gray-800 border-b-4 border-indigo-100 dark:border-gray-700 flex justify-center items-center relative shadow-sm transition-colors">
    <motion.h1 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="text-4xl font-black text-indigo-600 dark:text-indigo-400 tracking-tighter"
    >
      MindPlay Arena
    </motion.h1>
  </header>
);

const Footer = () => (
  <footer className="py-8 px-4 bg-gray-50 dark:bg-gray-900 border-t-2 border-gray-100 dark:border-gray-800 text-center space-y-4 transition-colors">
    <div className="max-w-2xl mx-auto space-y-4 text-gray-600 dark:text-gray-400 font-medium text-sm">
      <p className="text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-widest">B.Tech PiP Project</p>
      <p>Electronics & Communication Engineering<br />Batch of 2023-27</p>
      <div className="pt-2">
        <p className="font-bold text-gray-800 dark:text-gray-200">Team Name - APEX</p>
        <p className="mt-2 text-xs opacity-80">
          Team Members Name - Manish (69, ECE B)<br />
          Vardan (67, ECE B)<br />
          Sparsh (109, ECE A)
        </p>
      </div>
    </div>
  </footer>
);

export default function App() {
  // --- Persistent State ---
  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = localStorage.getItem('mindplay_state');
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...parsed, mode: 'MENU' }; // Always start at menu
    }
    return {
      score: 0,
      streak: 0,
      playerName: '',
      mode: 'MENU',
      history: [],
      stats: {
        totalGames: 0,
        highestScore: 0,
        totalCorrect: 0,
        totalQuestions: 0,
        lastPlayedMode: null
      },
      settings: {
        darkMode: false,
        soundEnabled: true
      }
    };
  });

  const [showHomeConfirm, setShowHomeConfirm] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  // --- Effects ---
  useEffect(() => {
    localStorage.setItem('mindplay_state', JSON.stringify(gameState));
    if (gameState.settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [gameState]);

  const showFeedback = (type: 'success' | 'error', message: string) => {
    playSound(type === 'success' ? 'correct' : 'wrong', gameState.settings.soundEnabled);
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 2000);
  };

  const updateStats = (correct: boolean, mode: string, finalScore?: number) => {
    setGameState(prev => {
      const newStats = { ...prev.stats };
      newStats.totalQuestions += 1;
      if (correct) newStats.totalCorrect += 1;
      if (finalScore) {
        newStats.totalGames += 1;
        newStats.highestScore = Math.max(newStats.highestScore, finalScore);
        newStats.lastPlayedMode = mode;
      }
      return { ...prev, stats: newStats };
    });
  };

  const addHistory = (mode: string, score: number) => {
    const entry: GameHistoryEntry = {
      date: new Date().toLocaleDateString(),
      mode,
      score
    };
    setGameState(prev => ({
      ...prev,
      history: [entry, ...prev.history].slice(0, 20)
    }));
  };

  const handleHomeClick = () => {
    if (gameState.mode === 'MENU') return;
    playSound('click', gameState.settings.soundEnabled);
    setShowHomeConfirm(true);
  };

  const confirmHome = () => {
    if (gameState.mode !== 'PROFILE' && gameState.mode !== 'SETTINGS' && gameState.mode !== 'HISTORY') {
        addHistory(gameState.mode, gameState.score);
        updateStats(false, gameState.mode, gameState.score);
    }
    setGameState(prev => ({ ...prev, score: 0, streak: 0, mode: 'MENU' }));
    setShowHomeConfirm(false);
  };

  return (
    <div className={`min-h-screen font-sans flex flex-col transition-colors ${gameState.settings.darkMode ? 'bg-gray-900 text-gray-100' : 'bg-indigo-50 text-gray-900'}`}>
      <Header />
      
      {/* Navigation Controls */}
      <div className="fixed top-4 left-4 right-4 z-50 flex justify-between items-center pointer-events-none">
        {gameState.mode !== 'MENU' && (
          <button 
            onClick={handleHomeClick}
            className="p-3 bg-white dark:bg-gray-800 hover:bg-indigo-50 dark:hover:bg-gray-700 rounded-full shadow-lg border-2 border-indigo-100 dark:border-gray-700 transition-colors cursor-pointer group pointer-events-auto"
          >
            <Home className="w-6 h-6 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform" />
          </button>
        )}
        <div className="flex gap-2 pointer-events-auto">
          <button 
            onClick={() => setGameState(prev => ({ ...prev, settings: { ...prev.settings, darkMode: !prev.settings.darkMode }}))}
            className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg border-2 border-indigo-100 dark:border-gray-700 transition-colors group"
          >
            {gameState.settings.darkMode ? <Sun className="w-6 h-6 text-yellow-400" /> : <Moon className="w-6 h-6 text-indigo-600" />}
          </button>
          <button 
            onClick={() => setGameState(prev => ({ ...prev, settings: { ...prev.settings, soundEnabled: !prev.settings.soundEnabled }}))}
            className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg border-2 border-indigo-100 dark:border-gray-700 transition-colors group"
          >
            {gameState.settings.soundEnabled ? <Volume2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" /> : <VolumeX className="w-6 h-6 text-gray-400" />}
          </button>
        </div>
      </div>

      <main className="flex-grow flex flex-col items-center justify-center p-4 max-w-4xl mx-auto w-full pt-20">
        <AnimatePresence mode="wait">
          {gameState.mode === 'MENU' && (
            <LandingScreen key="menu" gameState={gameState} setGameState={setGameState} />
          )}
          {gameState.mode === 'PROFILE' && (
            <ProfileScreen key="profile" gameState={gameState} setGameState={setGameState} />
          )}
          {gameState.mode === 'SETTINGS' && (
            <SettingsScreen key="settings" gameState={gameState} setGameState={setGameState} />
          )}
          {gameState.mode === 'HISTORY' && (
            <HistoryScreen key="history" gameState={gameState} setGameState={setGameState} />
          )}
          {gameState.mode === 'SCRAMBLE' && (
            <ScrambleGame key="scramble" gameState={gameState} setGameState={setGameState} showFeedback={showFeedback} updateStats={updateStats} />
          )}
          {gameState.mode === 'RIDDLE' && (
            <RiddleGame key="riddle" gameState={gameState} setGameState={setGameState} showFeedback={showFeedback} updateStats={updateStats} />
          )}
          {gameState.mode === 'GUESS' && (
            <GuessGame key="guess" gameState={gameState} setGameState={setGameState} showFeedback={showFeedback} updateStats={updateStats} />
          )}
          {gameState.mode === 'QUIZ' && (
            <QuizGame key="quiz" gameState={gameState} setGameState={setGameState} showFeedback={showFeedback} updateStats={updateStats} finalize={addHistory}/>
          )}
        </AnimatePresence>
      </main>

      <Footer />

      {/* Floating Stats Area */}
      {['SCRAMBLE', 'RIDDLE', 'GUESS', 'QUIZ'].includes(gameState.mode) && (
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed bottom-32 left-1/2 -translate-x-1/2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md px-6 py-3 rounded-full shadow-xl border-2 border-indigo-100 dark:border-gray-700 flex gap-8 items-center z-40 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <span className="font-bold text-indigo-900 dark:text-indigo-300">{gameState.score}</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-orange-500" />
            <span className="font-bold text-indigo-900 dark:text-indigo-300">{gameState.streak}</span>
          </div>
        </motion.div>
      )}

      {/* Home Confirmation Modal */}
      <AnimatePresence>
        {showHomeConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-indigo-900/40 dark:bg-black/60 backdrop-blur-sm"
              onClick={() => setShowHomeConfirm(false)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-sm w-full shadow-2xl relative z-10 text-center transition-colors"
            >
              <HelpCircle className="w-16 h-16 text-indigo-500 mx-auto mb-4" />
              <h3 className="text-2xl font-black text-gray-900 dark:text-gray-100 mb-2">Back to Home?</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Your current session progress will be recorded in history.</p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setShowHomeConfirm(false)}
                  className="flex-1 py-3 px-4 rounded-xl border-2 border-gray-100 dark:border-gray-700 font-bold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
                >
                  Stay
                </button>
                <button 
                  onClick={confirmHome}
                  className="flex-1 py-3 px-4 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-colors shadow-lg shadow-red-200 dark:shadow-none"
                >
                  Go Home
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Feedback Notification */}
      <AnimatePresence>
        {feedback && (
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className={`fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 rounded-2xl shadow-2xl z-[110] flex items-center gap-3 border-2 ${
              feedback.type === 'success' ? 'bg-green-500 border-green-400 text-white' : 'bg-red-500 border-red-400 text-white'
            }`}
          >
            {feedback.type === 'success' ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
            <span className="font-black text-lg">{feedback.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Navigation Screens ---

function LandingScreen({ gameState, setGameState }: any) {
  const [nameInput, setNameInput] = useState(gameState.playerName);

  const startGame = (mode: GameState['mode']) => {
    if (!nameInput.trim()) {
      alert("Introduce yourself first!");
      return;
    }
    playSound('click', gameState.settings.soundEnabled);
    setGameState((prev: any) => ({ ...prev, playerName: nameInput, mode }));
  };

  const menuItems = [
    { title: 'Word Scramble', mode: 'SCRAMBLE', icon: Puzzle, color: 'bg-pink-500 hover:bg-pink-600', desc: 'Unscramble the chaos!' },
    { title: 'Bujho To Jaane', mode: 'RIDDLE', icon: Brain, color: 'bg-blue-500 hover:bg-blue-600', desc: 'Can you solve them all?' },
    { title: 'Guess the Word', mode: 'GUESS', icon: Eye, color: 'bg-green-500 hover:bg-green-600', desc: 'Follow the clues...' },
    { title: 'Rapid Fire Quiz', mode: 'QUIZ', icon: Timer, color: 'bg-orange-500 hover:bg-orange-600', desc: 'Race against time!' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full space-y-10"
    >
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-extrabold text-indigo-900 dark:text-indigo-200">Welcome Back{gameState.playerName ? `, ${gameState.playerName}` : ''}!</h2>
        {!gameState.playerName && (
          <div className="max-w-md mx-auto">
            <input 
              type="text" 
              placeholder="Who are you?"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              className="w-full px-6 py-4 rounded-3xl border-4 border-white dark:border-gray-800 bg-white dark:bg-gray-800 shadow-xl focus:border-indigo-400 outline-none text-xl font-bold transition-all text-center placeholder:text-gray-300 dark:placeholder:text-gray-600"
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {menuItems.map((item, idx) => (
          <motion.button
            key={item.mode}
            whileHover={{ scale: 1.05, translateY: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => startGame(item.mode as any)}
            className={`${item.color} p-8 rounded-[2.5rem] shadow-2xl text-white text-left relative overflow-hidden group border-b-8 border-black/10 transition-all`}
          >
            <div className="relative z-10 flex items-center gap-5">
              <div className="p-4 bg-white/20 backdrop-blur-md rounded-2xl shadow-inner">
                <item.icon className="w-10 h-10" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-black">{item.title}</h3>
                <p className="text-white/80 font-medium text-sm">{item.desc}</p>
              </div>
              <Play className="w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <item.icon className="absolute -right-6 -bottom-6 w-40 h-40 text-white/5 rotate-12 transition-transform group-hover:rotate-0" />
          </motion.button>
        ))}
      </div>

      <div className="flex justify-center gap-4 pt-6">
        <NavButton mode="PROFILE" icon={User} color="bg-indigo-100 text-indigo-600 dark:bg-gray-800 dark:text-indigo-400" onClick={() => setGameState((p:any)=>({...p, mode:'PROFILE'}))}>Profile</NavButton>
        <NavButton mode="HISTORY" icon={HistoryIcon} color="bg-indigo-100 text-indigo-600 dark:bg-gray-800 dark:text-indigo-400" onClick={() => setGameState((p:any)=>({...p, mode:'HISTORY'}))}>History</NavButton>
        <NavButton mode="SETTINGS" icon={SettingsIcon} color="bg-indigo-100 text-indigo-600 dark:bg-gray-800 dark:text-indigo-400" onClick={() => setGameState((p:any)=>({...p, mode:'SETTINGS'}))}>Settings</NavButton>
      </div>
    </motion.div>
  );
}

function ProfileScreen({ gameState, setGameState }: any) {
    const accuracy = gameState.stats.totalQuestions > 0 
        ? Math.round((gameState.stats.totalCorrect / gameState.stats.totalQuestions) * 100) 
        : 0;

    return (
        <ScreenFrame title="Player Profile" onBack={() => setGameState((p:any)=>({...p, mode:'MENU'}))}>
            <div className="space-y-8">
                <div className="flex flex-col items-center bg-indigo-600 dark:bg-indigo-500 p-8 rounded-[2.5rem] text-white shadow-xl">
                    <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-4">
                        <User className="w-12 h-12" />
                    </div>
                    <h3 className="text-3xl font-black">{gameState.playerName || 'Anonymous'}</h3>
                    <p className="opacity-80 font-medium">Brave Challenger</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <StatCard label="Highest Score" value={gameState.stats.highestScore} icon={Trophy} color="text-yellow-500" />
                    <StatCard label="Accuracy" value={`${accuracy}%`} icon={Percent} color="text-green-500" />
                    <StatCard label="Games Played" value={gameState.stats.totalGames} icon={Gamepad2} color="text-blue-500" />
                    <StatCard label="Questions Hit" value={gameState.stats.totalQuestions} icon={Zap} color="text-orange-500" />
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border-2 border-indigo-50 dark:border-gray-700">
                    <p className="text-gray-500 dark:text-gray-400 font-bold mb-2">Last Mode Played</p>
                    <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{gameState.stats.lastPlayedMode || 'None'}</p>
                </div>
            </div>
        </ScreenFrame>
    );
}

function HistoryScreen({ gameState, setGameState }: any) {
    return (
        <ScreenFrame title="Game History" onBack={() => setGameState((p:any)=>({...p, mode:'MENU'}))}>
            <div className="space-y-4">
                {gameState.history.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                        <RotateCcw className="w-16 h-16 mx-auto mb-4 opacity-20" />
                        <p className="text-xl font-bold">No history available yet.</p>
                        <p>Go play some games!</p>
                    </div>
                ) : (
                    gameState.history.map((entry: any, i: number) => (
                        <motion.div 
                            key={i}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: i * 0.05 }}
                            className="bg-white dark:bg-gray-800 p-5 rounded-2xl flex items-center justify-between border-2 border-indigo-50 dark:border-gray-700 shadow-sm transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-indigo-50 dark:bg-gray-700 rounded-xl text-indigo-600 dark:text-indigo-400">
                                    <Calendar className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-black text-lg">{entry.mode}</h4>
                                    <p className="text-gray-400 text-sm font-medium">{entry.date}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Score</p>
                                <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{entry.score}</p>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </ScreenFrame>
    );
}

function SettingsScreen({ gameState, setGameState }: any) {
    const resetData = () => {
        if (confirm("Are you sure? This will delete all your local high scores and history!")) {
            localStorage.removeItem('mindplay_state');
            window.location.reload();
        }
    };

    return (
        <ScreenFrame title="Settings" onBack={() => setGameState((p:any)=>({...p, mode:'MENU'}))}>
            <div className="space-y-6">
                <SettingToggle 
                    label="Dark Mode" 
                    icon={gameState.settings.darkMode ? Moon : Sun} 
                    active={gameState.settings.darkMode} 
                    onToggle={() => setGameState((p:any)=>({...p, settings:{...p.settings, darkMode:!p.settings.darkMode}}))}
                />
                <SettingToggle 
                    label="Sound Effects" 
                    icon={gameState.settings.soundEnabled ? Volume2 : VolumeX} 
                    active={gameState.settings.soundEnabled} 
                    onToggle={() => setGameState((p:any)=>({...p, settings:{...p.settings, soundEnabled:!p.settings.soundEnabled}}))}
                />
                
                <div className="pt-8">
                    <button 
                        onClick={resetData}
                        className="w-full py-4 rounded-2xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-bold border-2 border-red-100 dark:border-red-900/50 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                    >
                        Reset All Application Data
                    </button>
                    <p className="text-center text-gray-400 text-xs mt-4">MindPlay Arena v2.0.0 (Local Storage Only)</p>
                </div>
            </div>
        </ScreenFrame>
    );
}

// --- Game Modes ---

function ScrambleGame({ gameState, setGameState, showFeedback, updateStats }: any) {
  const [word, setWord] = useState('');
  const [scrambled, setScrambled] = useState('');
  const [userInput, setUserInput] = useState('');
  const [hintsUsed, setHintsUsed] = useState(0);

  const generateNewWord = useCallback((isSkip = false) => {
    if (isSkip) updateStats(false, 'SCRAMBLE');
    const randomWord = SCRAMBLE_WORDS[Math.floor(Math.random() * SCRAMBLE_WORDS.length)];
    setWord(randomWord);
    setScrambled(shuffleArray(randomWord.split('')).join(''));
    setUserInput('');
    setHintsUsed(0);
  }, [updateStats]);

  useEffect(() => {
    generateNewWord();
  }, [generateNewWord]);

  const checkAnswer = () => {
    if (userInput.toUpperCase().trim() === word) {
      const points = 10 - (hintsUsed * 3);
      setGameState((prev: any) => ({ ...prev, score: prev.score + points, streak: prev.streak + 1 }));
      showFeedback('success', `Awesome! +${points}`);
      updateStats(true, 'SCRAMBLE');
      generateNewWord();
    } else {
      setGameState((prev: any) => ({ ...prev, score: Math.max(0, prev.score - 2), streak: 0 }));
      showFeedback('error', 'Wrong Scramble! -2');
    }
  };

  const getHint = () => {
    if (hintsUsed >= 2) return;
    setGameState((prev: any) => ({ ...prev, score: Math.max(0, prev.score - 2) }));
    setHintsUsed(prev => prev + 1);
    const clue = hintsUsed === 0 ? `Starts with: ${word[0]}` : `Ends with: ${word[word.length - 1]}`;
    alert(`Hint Used (-2 points): ${clue}`);
  };

  return (
    <GameContainer title="Word Scramble" subtitle="Move letters to find the word">
      <div className="text-center space-y-8">
        <div className="flex flex-wrap justify-center gap-3">
          {scrambled.split('').map((char, i) => (
            <motion.div 
              key={i} 
              initial={{ scale: 0, rotate: 45 }} 
              animate={{ scale: 1, rotate: 0 }} 
              className="w-14 h-14 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center text-3xl font-black text-indigo-600 dark:text-indigo-400 shadow-xl border-2 border-indigo-100 dark:border-gray-700"
            >
              {char}
            </motion.div>
          ))}
        </div>

        <input 
          type="text" 
          autoFocus
          placeholder="Unscramble here..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
          className="w-full max-w-md px-8 py-5 rounded-[2rem] border-4 border-indigo-200 dark:border-indigo-900 bg-white dark:bg-gray-800 text-center text-3xl font-black outline-none focus:border-indigo-500 shadow-2xl transition-all uppercase tracking-widest"
        />

        <div className="flex flex-wrap justify-center gap-4">
          <GameButton onClick={checkAnswer} variant="primary" icon={CheckCircle2}>Submit</GameButton>
          <GameButton onClick={getHint} variant="hint" icon={Lightbulb} disabled={hintsUsed >= 2}>Hint ({2 - hintsUsed})</GameButton>
          <GameButton onClick={() => generateNewWord(true)} variant="secondary" icon={SkipForward}>Skip Word</GameButton>
        </div>
      </div>
    </GameContainer>
  );
}

function RiddleGame({ gameState, setGameState, showFeedback, updateStats }: any) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [hintsUsed, setHintsUsed] = useState(0);
  const riddles = useMemo(() => shuffleArray(RIDDLES), []);
  const riddle = riddles[currentIdx];

  const nextRiddle = (isSkip = false) => {
    if (isSkip) updateStats(false, 'RIDDLE');
    const nextItem = (currentIdx + 1) % riddles.length;
    setCurrentIdx(nextItem);
    setUserInput('');
    setHintsUsed(0);
  };

  const checkAnswer = () => {
    if (userInput.toUpperCase().trim() === riddle.answer) {
      const points = 25 - (hintsUsed * 7);
      setGameState((prev: any) => ({ ...prev, score: prev.score + points, streak: prev.streak + 1 }));
      showFeedback('success', `Correct! +${points}`);
      updateStats(true, 'RIDDLE');
      nextRiddle();
    } else {
      setGameState((prev: any) => ({ ...prev, score: Math.max(0, prev.score - 5), streak: 0 }));
      showFeedback('error', 'Wrong Answer! -5');
    }
  };

  return (
    <GameContainer title="Bujho To Jaane" subtitle="Think hard and answer!">
      <div className="text-center space-y-6">
        <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            key={currentIdx}
            className="bg-white dark:bg-gray-800 p-10 rounded-[3rem] border-4 border-indigo-100 dark:border-indigo-900 shadow-2xl relative"
        >
          <Brain className="absolute -top-6 -left-6 w-12 h-12 text-indigo-500 bg-white dark:bg-gray-900 rounded-full p-2 border-4 border-indigo-100 dark:border-indigo-900" />
          <p className="text-2xl font-bold text-gray-800 dark:text-gray-100 leading-relaxed italic">"{riddle.question}"</p>
        </motion.div>

        <input 
          type="text" 
          autoFocus
          placeholder="I am..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
          className="w-full max-w-md px-8 py-5 rounded-[2rem] border-4 border-indigo-200 dark:border-indigo-900 bg-white dark:bg-gray-800 text-center text-3xl font-black outline-none focus:border-indigo-500 shadow-2xl transition-all uppercase"
        />

        <div className="flex flex-wrap justify-center gap-4">
          <GameButton onClick={checkAnswer} variant="primary" icon={CheckCircle2}>Solve</GameButton>
          <GameButton onClick={() => {
            if (hintsUsed >= 2) return;
            setGameState((p:any)=>({...p, score: Math.max(0, p.score - 5)}));
            alert(`Hint Used (-5 points): ${riddle.hints[hintsUsed]}`);
            setHintsUsed(prev => prev + 1);
          }} variant="hint" icon={Lightbulb} disabled={hintsUsed >= 2}>Hint ({2 - hintsUsed})</GameButton>
          <GameButton onClick={() => {
              setGameState((p:any)=>({...p, score: Math.max(0, p.score - 15)}));
              alert(`Revealing (-15 points): It is ${riddle.answer}`);
              updateStats(false, 'RIDDLE');
              nextRiddle();
          }} variant="secondary" icon={Eye}>Answer</GameButton>
        </div>
      </div>
    </GameContainer>
  );
}

function GuessGame({ gameState, setGameState, showFeedback, updateStats }: any) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [hintsUsed, setHintsUsed] = useState(0);
  const words = useMemo(() => shuffleArray(GUESS_WORDS), []);
  const item = words[currentIdx];

  const nextWord = (isSkip = false) => {
    if (isSkip) updateStats(false, 'GUESS');
    setCurrentIdx((currentIdx + 1) % words.length);
    setUserInput('');
    setHintsUsed(0);
  };

  const checkAnswer = () => {
    if (userInput.toUpperCase().trim() === item.word) {
      const points = 20 - (hintsUsed * 5);
      setGameState((prev: any) => ({ ...prev, score: prev.score + points, streak: prev.streak + 1 }));
      showFeedback('success', `Spot on! +${points}`);
      updateStats(true, 'GUESS');
      nextWord();
    } else {
      setGameState((prev: any) => ({ ...prev, score: Math.max(0, prev.score - 3), streak: 0 }));
      showFeedback('error', 'Keep trying! -3');
    }
  };

  return (
    <GameContainer title="Guess the Word" subtitle={`Category: ${item.category}`}>
      <div className="text-center space-y-6">
        <div className="bg-white dark:bg-gray-800 p-10 rounded-[3rem] border-4 border-green-100 dark:border-green-900 shadow-2xl">
           <div className="flex flex-wrap justify-center gap-3">
            {item.word.split('').map((_, i) => (
              <div key={i} className="w-10 h-16 bg-green-50 dark:bg-gray-900 border-b-8 border-green-500 dark:border-green-600 flex items-center justify-center text-2xl font-black transition-colors">
                {userInput[i] || '_'}
              </div>
            ))}
           </div>
           <div className="mt-8 flex justify-center gap-4">
               <span className="px-4 py-2 bg-green-100 dark:bg-green-900/50 rounded-full text-green-700 dark:text-green-300 font-bold text-sm tracking-widest">{item.word.length} LETTERS</span>
               {hintsUsed >= 1 && <span className="px-4 py-2 bg-yellow-100 dark:bg-yellow-900/50 rounded-full text-yellow-700 dark:text-yellow-300 font-bold text-sm">Starts with: {item.word[0]}</span>}
           </div>
        </div>

        <input 
          type="text" 
          autoFocus
          placeholder="My guess..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
          className="w-full max-w-md px-8 py-5 rounded-[2rem] border-4 border-green-200 dark:border-green-800 bg-white dark:bg-gray-800 text-center text-3xl font-black outline-none focus:border-green-500 shadow-2xl transition-all uppercase"
        />

        <div className="flex flex-wrap justify-center gap-4">
          <GameButton onClick={checkAnswer} variant="primary" icon={CheckCircle2}>Guess</GameButton>
          <GameButton onClick={() => {
            if (hintsUsed >= 2) return;
            setGameState((p:any)=>({...p, score: Math.max(0, p.score - 4)}));
            alert(`Hint Used (-4 points): ${item.hints[hintsUsed]}`);
            setHintsUsed(prev => prev + 1);
          }} variant="hint" icon={Lightbulb} disabled={hintsUsed >= 2}>Hint ({2 - hintsUsed})</GameButton>
          <GameButton onClick={() => nextWord(true)} variant="secondary" icon={SkipForward}>Skip (-5)</GameButton>
        </div>
      </div>
    </GameContainer>
  );
}

function QuizGame({ gameState, setGameState, showFeedback, updateStats, finalize }: any) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [gameScore, setGameScore] = useState(0);
  const questions = useMemo(() => shuffleArray(QUIZ_QUESTIONS).slice(0, 5), []);
  const q = questions[currentIdx];

  useEffect(() => {
    if (timeLeft <= 0) {
      showFeedback('error', 'Time\'s Up!');
      handleAnswer(''); // Force failure
      return;
    }
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const endQuiz = (currScore: number) => {
    finalize('QUIZ', currScore);
    updateStats(false, 'QUIZ', currScore);
    alert(`Quiz Finished! Session Score: ${currScore}`);
    setGameState((prev: any) => ({ ...prev, mode: 'MENU', score: 0, streak: 0 }));
  };

  const handleAnswer = (opt: string) => {
    const isCorrect = opt === q.answer;
    let newScore = gameScore;
    if (isCorrect) {
      const bonus = timeLeft > 10 ? 5 : 0;
      newScore += (10 + bonus);
      setGameScore(newScore);
      setGameState((prev: any) => ({ ...prev, streak: prev.streak + 1 }));
      showFeedback('success', `Bingo! +${10+bonus}`);
      updateStats(true, 'QUIZ');
    } else {
      setGameState((prev: any) => ({ ...prev, streak: 0 }));
      showFeedback('error', 'Wrong choice!');
      updateStats(false, 'QUIZ');
    }

    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setTimeLeft(15);
    } else {
      endQuiz(newScore);
    }
  };

  return (
    <GameContainer title="Rapid Fire" subtitle={`Question ${currentIdx + 1} of 5`}>
      <div className="text-center space-y-8">
        <div className="flex justify-center flex-col items-center gap-2">
            <div className={`w-24 h-24 rounded-full border-8 bg-white dark:bg-gray-800 shadow-inner flex items-center justify-center relative transition-colors ${timeLeft < 5 ? 'border-red-400 dark:border-red-900' : 'border-indigo-100 dark:border-gray-700'}`}>
                <span className={`text-4xl font-black ${timeLeft < 5 ? 'text-red-500 animate-pulse' : 'text-indigo-600 dark:text-indigo-400'}`}>
                {timeLeft}
                </span>
                <Timer className={`absolute -top-3 -right-3 w-8 h-8 rounded-full p-1 shadow-lg ${timeLeft < 5 ? 'bg-red-500 text-white' : 'bg-white text-indigo-600'}`} />
            </div>
            <p className="font-black text-indigo-600 dark:text-indigo-400">SESSION SCORE: {gameScore}</p>
        </div>

        <motion.div 
            key={currentIdx}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="bg-white dark:bg-gray-800 p-10 rounded-[3rem] border-4 border-indigo-100 dark:border-gray-700 shadow-2xl"
        >
          <h3 className="text-2xl font-black text-gray-800 dark:text-gray-100">{q.question}</h3>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto w-full">
          {q.options.map((opt, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleAnswer(opt)}
              className="p-6 bg-white dark:bg-gray-800 border-4 border-indigo-50 dark:border-gray-700 hover:border-indigo-400 dark:hover:border-indigo-500 rounded-[2rem] font-bold text-xl text-gray-700 dark:text-gray-200 shadow-xl transition-all text-left flex items-center gap-5 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-gray-700 flex items-center justify-center text-indigo-500 dark:text-indigo-300 font-black group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                {String.fromCharCode(65 + i)}
              </div>
              <span className="flex-1">{opt}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </GameContainer>
  );
}

// --- Frame Components ---

function ScreenFrame({ children, title, onBack }: { children: React.ReactNode, title: string, onBack: () => void }) {
    return (
        <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full max-w-2xl space-y-8 py-4"
        >
            <div className="flex items-center gap-4">
                <button onClick={onBack} className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-md border-2 border-indigo-100 dark:border-gray-700">
                    <ChevronLeft className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </button>
                <h2 className="text-3xl font-black text-indigo-900 dark:text-indigo-200">{title}</h2>
            </div>
            {children}
        </motion.div>
    );
}

function StatCard({ label, value, icon: Icon, color }: any) {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border-2 border-indigo-50 dark:border-gray-700 shadow-sm transition-colors">
            <Icon className={`w-8 h-8 ${color} mb-3`} />
            <p className="text-gray-400 dark:text-gray-500 font-bold text-xs uppercase tracking-widest">{label}</p>
            <p className="text-3xl font-black dark:text-gray-100">{value}</p>
        </div>
    );
}

function SettingToggle({ label, icon: Icon, active, onToggle }: any) {
    return (
        <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-6 rounded-3xl border-2 border-indigo-50 dark:border-gray-700 transition-colors">
            <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${active ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-400'}`}>
                    <Icon className="w-6 h-6" />
                </div>
                <span className="text-xl font-bold dark:text-gray-100">{label}</span>
            </div>
            <button 
                onClick={onToggle}
                className={`w-16 h-8 rounded-full relative transition-colors ${active ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'}`}
            >
                <motion.div 
                    animate={{ x: active ? 32 : 4 }}
                    className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md"
                />
            </button>
        </div>
    );
}

function GameContainer({ children, title, subtitle }: { children: React.ReactNode, title: string, subtitle: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full space-y-10"
    >
      <div className="text-center group">
        <h2 className="text-5xl font-black text-indigo-600 dark:text-indigo-400 tracking-tight group-hover:scale-105 transition-transform inline-block">
            {title}
        </h2>
        <div className="h-1.5 w-24 bg-indigo-500 mx-auto mt-2 rounded-full opacity-50" />
        <p className="text-gray-500 dark:text-gray-400 mt-4 font-bold uppercase tracking-widest text-xs">{subtitle}</p>
      </div>
      {children}
    </motion.div>
  );
}

function NavButton({ icon: Icon, children, color, onClick }: any) {
    return (
        <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold shadow-md transition-all ${color}`}
        >
            <Icon className="w-5 h-5" />
            {children}
        </motion.button>
    );
}

function GameButton({ onClick, children, variant, icon: Icon, disabled = false }: any) {
  const styles = {
    primary: "bg-indigo-600 dark:bg-indigo-500 text-white shadow-xl shadow-indigo-200 dark:shadow-none border-b-8 border-indigo-800 dark:border-indigo-700 active:border-b-0",
    secondary: "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 shadow-lg border-b-8 border-gray-200 dark:border-gray-700 active:border-b-0",
    hint: "bg-yellow-400 dark:bg-yellow-500 text-yellow-900 border-b-8 border-yellow-600 dark:border-yellow-700 active:border-b-0 shadow-xl shadow-yellow-100 dark:shadow-none"
  };

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.05, y: -2 } : {}}
      whileTap={!disabled ? { scale: 0.95, y: 0 } : {}}
      disabled={disabled}
      onClick={onClick}
      className={`px-8 py-5 rounded-[2rem] font-black text-xl flex items-center gap-3 transition-all ${disabled ? 'opacity-30 cursor-not-allowed grayscale' : styles[variant as keyof typeof styles]}`}
    >
      {Icon && <Icon className="w-7 h-7" />}
      {children}
    </motion.button>
  );
}
