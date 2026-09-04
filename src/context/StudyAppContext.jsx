import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_SUBJECTS,
  INITIAL_RESOURCES,
  INITIAL_FLASHCARDS,
  INITIAL_TASKS
} from '../utils/sampleData';
import {
  getLocalStorage,
  setLocalStorage,
  saveBlob,
  getBlob,
  deleteBlob
} from '../utils/storage';
import { generateId } from '../utils/helpers';

const StudyAppContext = createContext(null);

export function StudyAppProvider({ children }) {
  // Subjects state
  const [subjects, setSubjects] = useState(() => 
    getLocalStorage('edustudy_subjects', INITIAL_SUBJECTS)
  );

  // Active navigation view: 'dashboard' | 'subject' | 'tools' | 'chat' | 'flashcards' | 'tasks' | 'developer'
  const [currentView, setCurrentView] = useState('dashboard');
  
  // Active subject ID
  const [activeSubjectId, setActiveSubjectId] = useState(null);

  // Resources state
  const [resources, setResources] = useState(() => 
    getLocalStorage('edustudy_resources', INITIAL_RESOURCES)
  );

  // Flashcards state
  const [flashcards, setFlashcards] = useState(() => 
    getLocalStorage('edustudy_flashcards', INITIAL_FLASHCARDS)
  );

  // Tasks / Homework state
  const [tasks, setTasks] = useState(() => 
    getLocalStorage('edustudy_tasks', INITIAL_TASKS)
  );

  // Current User Profile
  const [userProfile, setUserProfile] = useState(() => 
    getLocalStorage('edustudy_user_profile', {
      name: 'Tanush',
      role: 'Student',
      statusText: 'Studying for Board Exams 🚀',
      avatarGradient: 'from-indigo-500 to-purple-600',
    })
  );

  // Developer / Admin Studio Mode
  const [developerMode, setDeveloperMode] = useState(() => 
    getLocalStorage('edustudy_dev_mode', false)
  );
  const [devPin, setDevPin] = useState(() => 
    getLocalStorage('edustudy_dev_pin', 'dev2026')
  );
  const [isDevModalOpen, setIsDevModalOpen] = useState(false);

  // Global Search Query
  const [searchQuery, setSearchQuery] = useState('');

  // Active Subject Tab: 'stream' | 'classwork' | 'tools'
  const [subjectActiveTab, setSubjectActiveTab] = useState('stream');

  // Modals state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [isDataBackupModalOpen, setIsDataBackupModalOpen] = useState(false);
  const [isUserProfileModalOpen, setIsUserProfileModalOpen] = useState(false);
  const [activeMediaResource, setActiveMediaResource] = useState(null);

  // Theme mode: 'light' | 'dark'
  const [darkMode, setDarkMode] = useState(() => {
    return getLocalStorage('edustudy_dark_mode', false);
  });

  // URL Query parameter check on startup (e.g. ?dev=true or ?admin=true)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('dev') === 'true' || params.get('mode') === 'developer' || params.get('admin') === 'true') {
      setIsDevModalOpen(true);
    }
  }, []);

  // Sync to local storage
  useEffect(() => {
    setLocalStorage('edustudy_subjects', subjects);
  }, [subjects]);

  useEffect(() => {
    const metaResources = resources.map(res => {
      if (res.blobData && res.blobData.length > 50000) {
        const { blobData, ...rest } = res;
        return { ...rest, hasBinaryInIndexedDB: true };
      }
      return res;
    });
    setLocalStorage('edustudy_resources', metaResources);
  }, [resources]);

  useEffect(() => {
    setLocalStorage('edustudy_flashcards', flashcards);
  }, [flashcards]);

  useEffect(() => {
    setLocalStorage('edustudy_tasks', tasks);
  }, [tasks]);

  useEffect(() => {
    setLocalStorage('edustudy_user_profile', userProfile);
  }, [userProfile]);

  useEffect(() => {
    setLocalStorage('edustudy_dev_mode', developerMode);
  }, [developerMode]);

  useEffect(() => {
    setLocalStorage('edustudy_dev_pin', devPin);
  }, [devPin]);

  useEffect(() => {
    setLocalStorage('edustudy_dark_mode', darkMode);
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Navigate to subject detail
  const selectSubject = (subjectId) => {
    setActiveSubjectId(subjectId);
    setCurrentView('subject');
    setSubjectActiveTab('stream');
  };

  // Add / Upload new resource
  const addResource = async (resourceData, fileBlob = null) => {
    const newId = generateId('res');
    const newResource = {
      id: newId,
      ...resourceData,
      uploadedBy: userProfile.name,
      uploadedAt: new Date().toISOString(),
      pinned: false,
    };

    if (fileBlob) {
      await saveBlob(newId, fileBlob);
      newResource.hasBinaryInIndexedDB = true;
    }

    setResources(prev => [newResource, ...prev]);
    return newResource;
  };

  // Delete resource
  const deleteResource = async (id) => {
    await deleteBlob(id);
    setResources(prev => prev.filter(r => r.id !== id));
    if (activeMediaResource?.id === id) {
      setActiveMediaResource(null);
    }
  };

  // Toggle pin resource
  const togglePinResource = (id) => {
    setResources(prev => prev.map(r => r.id === id ? { ...r, pinned: !r.pinned } : r));
  };

  // Add custom subject
  const addSubject = (subjectData) => {
    const newId = generateId('subj');
    const newSubject = {
      id: newId,
      code: subjectData.code || `${subjectData.name.substring(0, 3).toUpperCase()}-101`,
      ...subjectData,
      topics: subjectData.topics || ['General Topics & Notes'],
    };
    setSubjects(prev => [...prev, newSubject]);
    return newSubject;
  };

  // Add flashcard
  const addFlashcard = (cardData) => {
    const newCard = {
      id: generateId('fc'),
      mastered: false,
      ...cardData,
    };
    setFlashcards(prev => [...prev, newCard]);
  };

  // Toggle flashcard mastery
  const toggleFlashcardMastery = (id) => {
    setFlashcards(prev => prev.map(fc => fc.id === id ? { ...fc, mastered: !fc.mastered } : fc));
  };

  // Task operations
  const addTask = (taskData) => {
    const newTask = {
      id: generateId('task'),
      completed: false,
      ...taskData,
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const toggleTask = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  // Export full app data to JSON
  const exportData = () => {
    const backup = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      subjects,
      resources,
      flashcards,
      tasks,
      userProfile,
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `EduStudy_Backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Import app data from JSON
  const importData = (jsonData) => {
    try {
      const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
      if (data.subjects) setSubjects(data.subjects);
      if (data.resources) setResources(data.resources);
      if (data.flashcards) setFlashcards(data.flashcards);
      if (data.tasks) setTasks(data.tasks);
      if (data.userProfile) setUserProfile(data.userProfile);
      return { success: true };
    } catch (e) {
      console.error('Import error', e);
      return { success: false, error: e.message };
    }
  };

  // Reset to initial sample data
  const resetToSampleData = () => {
    setSubjects(INITIAL_SUBJECTS);
    setResources(INITIAL_RESOURCES);
    setFlashcards(INITIAL_FLASHCARDS);
    setTasks(INITIAL_TASKS);
  };

  const activeSubject = subjects.find(s => s.id === activeSubjectId) || subjects[0] || null;

  return (
    <StudyAppContext.Provider
      value={{
        subjects,
        setSubjects,
        activeSubject,
        activeSubjectId,
        selectSubject,
        addSubject,
        currentView,
        setCurrentView,
        subjectActiveTab,
        setSubjectActiveTab,
        resources,
        setResources,
        addResource,
        deleteResource,
        togglePinResource,
        flashcards,
        setFlashcards,
        addFlashcard,
        toggleFlashcardMastery,
        tasks,
        setTasks,
        addTask,
        toggleTask,
        deleteTask,
        userProfile,
        setUserProfile,
        developerMode,
        setDeveloperMode,
        devPin,
        setDevPin,
        isDevModalOpen,
        setIsDevModalOpen,
        searchQuery,
        setSearchQuery,
        darkMode,
        setDarkMode,
        isUploadModalOpen,
        setIsUploadModalOpen,
        isSubjectModalOpen,
        setIsSubjectModalOpen,
        isDataBackupModalOpen,
        setIsDataBackupModalOpen,
        isUserProfileModalOpen,
        setIsUserProfileModalOpen,
        activeMediaResource,
        setActiveMediaResource,
        exportData,
        importData,
        resetToSampleData,
      }}
    >
      {children}
    </StudyAppContext.Provider>
  );
}

export function useStudyApp() {
  const context = useContext(StudyAppContext);
  if (!context) {
    throw new Error('useStudyApp must be used within a StudyAppProvider');
  }
  return context;
}
