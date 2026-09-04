import React, { useState } from 'react';
import {
  CheckSquare,
  Square,
  Plus,
  Trash2,
  Calendar,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useStudyApp } from '../../context/StudyAppContext';

export function TaskTracker({ subjectFilter = null }) {
  const { tasks, addTask, toggleTask, deleteTask, subjects } = useStudyApp();

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskSubjectId, setNewTaskSubjectId] = useState(subjectFilter || subjects[0]?.id || 'science');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('medium');
  const [isAdding, setIsAdding] = useState(false);

  // Filter tasks if subjectFilter passed
  const displayedTasks = tasks.filter(t => {
    if (!subjectFilter) return true;
    return t.subjectId === subjectFilter;
  });

  const handleToggle = (task) => {
    toggleTask(task.id);
    if (!task.completed) {
      // Trigger confetti celebration!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.7 }
        });
      } catch (e) {
        console.debug('Confetti effect blocked or not loaded');
      }
    }
  };

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    addTask({
      title: newTaskTitle.trim(),
      subjectId: newTaskSubjectId,
      dueDate: newTaskDueDate || new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString().split('T')[0],
      priority: newTaskPriority,
    });

    setNewTaskTitle('');
    setIsAdding(false);
  };

  const pendingCount = displayedTasks.filter(t => !t.completed).length;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-card space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <CheckSquare className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
              Homework & Tasks
            </h3>
            <p className="text-[11px] text-slate-400">
              {pendingCount} pending assignment{pendingCount !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-indigo-600 dark:text-indigo-400 transition-colors"
          title="Add assignment"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Add Task Form */}
      {isAdding && (
        <form onSubmit={handleCreateTask} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2.5 animate-fadeIn">
          <input
            type="text"
            required
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="What needs to be studied / solved?"
            className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
          />

          <div className="grid grid-cols-2 gap-2 text-xs">
            {!subjectFilter && (
              <select
                value={newTaskSubjectId}
                onChange={(e) => setNewTaskSubjectId(e.target.value)}
                className="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-[11px] text-slate-800 dark:text-slate-100 outline-none"
              >
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            )}

            <input
              type="date"
              value={newTaskDueDate}
              onChange={(e) => setNewTaskDueDate(e.target.value)}
              className="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-[11px] text-slate-800 dark:text-slate-100 outline-none"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex gap-1">
              {['high', 'medium', 'low'].map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setNewTaskPriority(p)}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase transition-all ${
                    newTaskPriority === p
                      ? p === 'high' ? 'bg-rose-500 text-white' : p === 'medium' ? 'bg-amber-500 text-white' : 'bg-emerald-500 text-white'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-2.5 py-1 text-xs text-slate-400 hover:text-slate-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700"
              >
                Add Task
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Task Item List */}
      <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
        {displayedTasks.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-6">
            No homework items on your list. All clear! ✨
          </p>
        ) : (
          displayedTasks.map(task => {
            const subject = subjects.find(s => s.id === task.subjectId);
            return (
              <div
                key={task.id}
                className={`group flex items-start justify-between gap-2 p-2.5 rounded-xl border transition-all ${
                  task.completed
                    ? 'bg-slate-50 dark:bg-slate-800/30 border-slate-100 dark:border-slate-800 opacity-60'
                    : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-indigo-300'
                }`}
              >
                <div className="flex items-start gap-2.5 min-w-0 flex-1">
                  <button
                    onClick={() => handleToggle(task)}
                    className="mt-0.5 text-indigo-600 dark:text-indigo-400 hover:scale-110 transition-transform flex-shrink-0"
                  >
                    {task.completed ? <CheckSquare className="w-4 h-4 fill-emerald-500 text-white" /> : <Square className="w-4 h-4 text-slate-300 dark:text-slate-600" />}
                  </button>

                  <div className="min-w-0 flex-1">
                    <p className={`text-xs font-medium leading-snug break-words ${
                      task.completed ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'
                    }`}>
                      {task.title}
                    </p>

                    <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                      {subject && <span className="font-semibold text-indigo-600 dark:text-indigo-400">{subject.name}</span>}
                      {task.dueDate && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{task.dueDate}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => deleteTask(task.id)}
                  className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 p-1 transition-opacity flex-shrink-0"
                  title="Delete task"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
