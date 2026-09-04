import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Coffee,
  Brain,
  Sparkles,
  Flame,
  Volume2
} from 'lucide-react';
import { playChimeSound } from '../../utils/helpers';

const MODES = {
  focus: { label: 'Focus Session', time: 25 * 60, icon: Brain, color: 'text-indigo-600', ringColor: '#4f46e5' },
  shortBreak: { label: 'Short Break', time: 5 * 60, icon: Coffee, color: 'text-emerald-600', ringColor: '#059669' },
  longBreak: { label: 'Long Break', time: 15 * 60, icon: Coffee, color: 'text-blue-600', ringColor: '#2563eb' },
};

export function PomodoroTimer() {
  const [currentMode, setCurrentMode] = useState('focus');
  const [timeLeft, setTimeLeft] = useState(MODES.focus.time);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);

  const timerRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsRunning(false);
            playChimeSound('timer-complete');
            if (currentMode === 'focus') {
              setSessionsCompleted(c => c + 1);
              setCurrentMode('shortBreak');
              return MODES.shortBreak.time;
            } else {
              setCurrentMode('focus');
              return MODES.focus.time;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning, currentMode]);

  const switchMode = (mode) => {
    setIsRunning(false);
    setCurrentMode(mode);
    setTimeLeft(MODES[mode].time);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(MODES[currentMode].time);
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
    if (!isRunning) {
      playChimeSound('notification');
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const totalModeTime = MODES[currentMode].time;
  const progressPercent = ((totalModeTime - timeLeft) / totalModeTime) * 100;

  // SVG Circular progress radius
  const radius = 95;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-card max-w-xl mx-auto space-y-6 text-center">
      
      {/* Mode Buttons */}
      <div className="flex justify-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl max-w-md mx-auto">
        {Object.entries(MODES).map(([key, config]) => (
          <button
            key={key}
            onClick={() => switchMode(key)}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
              currentMode === key
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            {config.label}
          </button>
        ))}
      </div>

      {/* Circular Progress Timer */}
      <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="128"
            cy="128"
            r={radius}
            className="text-slate-100 dark:text-slate-800 stroke-current"
            strokeWidth="10"
            fill="transparent"
          />
          <circle
            cx="128"
            cy="128"
            r={radius}
            stroke={MODES[currentMode].ringColor}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-linear"
          />
        </svg>

        {/* Center Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl sm:text-5xl font-black tracking-tight font-mono text-slate-900 dark:text-slate-100">
            {formattedTime}
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-1">
            {MODES[currentMode].label}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={resetTimer}
          className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95"
          title="Reset timer"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        <button
          onClick={toggleTimer}
          className="px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/40 transition-all active:scale-95 flex items-center gap-2"
        >
          {isRunning ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
          <span>{isRunning ? 'Pause' : 'Start Focus'}</span>
        </button>
      </div>

      {/* Streak & Sessions Completed */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-around text-xs">
        <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold">
          <Flame className="w-4 h-4" />
          <span>{sessionsCompleted} Focus Sessions Done</span>
        </div>

        <div className="text-slate-400">
          Tip: 25 mins focus + 5 mins break boosts memory retention!
        </div>
      </div>

    </div>
  );
}
