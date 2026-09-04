import React, { useState } from 'react';
import {
  Code,
  Sliders,
  FolderOpen,
  BookOpen,
  CheckSquare,
  MessageSquare,
  Database,
  Save,
  Plus,
  Trash2,
  Edit3,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Layers,
  Lock,
  ExternalLink,
  Terminal,
  Users,
  UserCheck,
  UserX,
  GraduationCap,
  Ban,
  Search,
  Mail,
  Calendar,
  Activity,
  KeyRound
} from 'lucide-react';
import { useStudyApp } from '../../context/StudyAppContext';
import { useChat } from '../../context/ChatContext';
import { AVATAR_COLORS } from '../../utils/helpers';

export function DeveloperStudio() {
  const {
    subjects,
    setSubjects,
    resources,
    setResources,
    flashcards,
    setFlashcards,
    tasks,
    setTasks,
    users,
    promoteUserToTeacher,
    demoteUserToStudent,
    banUser,
    unbanUser,
    deleteUser,
    addUser,
    updateUser,
    devPin,
    setDevPin,
    userProfile,
    setUserProfile,
    exportData,
    importData,
    resetToSampleData,
    setCurrentView,
    setDeveloperMode
  } = useStudyApp();

  const { messages, setMessages, sendMessage } = useChat();

  const [activeTab, setActiveTab] = useState('users'); // 'users' | 'subjects' | 'resources' | 'flashcards' | 'tasks' | 'chat' | 'rawjson' | 'security'
  const [editingSubject, setEditingSubject] = useState(null);
  const [editingResource, setEditingResource] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');

  // PIN change state
  const [newMasterPin, setNewMasterPin] = useState('');
  const [confirmMasterPin, setConfirmMasterPin] = useState('');

  // Add user form state
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState('student');
  const [newUserStatusText, setNewUserStatusText] = useState('New Classroom Member 👋');

  const [rawJsonText, setRawJsonText] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [announcementText, setAnnouncementText] = useState('');

  // 1. USER MANAGEMENT ACTIONS
  const handlePromoteTeacher = (userId, name) => {
    promoteUserToTeacher(userId);
    showNotice(`🎓 ${name} promoted to Teacher!`);
  };

  const handleDemoteStudent = (userId, name) => {
    demoteUserToStudent(userId);
    showNotice(`📚 ${name} set to Student role.`);
  };

  const handleBanToggle = (user) => {
    if (user.status === 'banned') {
      unbanUser(user.id);
      showNotice(`✅ ${user.name} has been unbanned.`);
    } else {
      if (window.confirm(`Are you sure you want to ban ${user.name}? They will be blocked from posting materials or chatting.`)) {
        banUser(user.id);
        showNotice(`🚫 ${user.name} has been banned.`);
      }
    }
  };

  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!newUserName.trim()) return;

    addUser({
      name: newUserName.trim(),
      email: newUserEmail.trim() || `${newUserName.toLowerCase().replace(/\s+/g, '')}@school.edu`,
      role: newUserRole,
      statusText: newUserStatusText.trim(),
      avatarGradient: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
    });

    setNewUserName('');
    setNewUserEmail('');
    setIsAddUserModalOpen(false);
    showNotice(`User account created successfully!`);
  };

  const handleSaveUser = (e) => {
    e.preventDefault();
    if (!editingUser) return;

    updateUser(editingUser.id, editingUser);
    setEditingUser(null);
    showNotice('User details updated!');
  };

  // 2. PIN CHANGE
  const handleChangePin = (e) => {
    e.preventDefault();
    if (!newMasterPin.trim()) return;
    if (newMasterPin !== confirmMasterPin) {
      alert('PIN confirmation does not match.');
      return;
    }
    setDevPin(newMasterPin.trim());
    setNewMasterPin('');
    setConfirmMasterPin('');
    showNotice('Master PIN changed successfully!');
  };

  // 3. SUBJECT OPERATIONS
  const handleSaveSubject = (e) => {
    e.preventDefault();
    if (!editingSubject) return;

    setSubjects(prev =>
      prev.map(s => (s.id === editingSubject.id ? editingSubject : s))
    );
    setEditingSubject(null);
    showNotice('Subject space updated successfully!');
  };

  const handleDeleteSubject = (id) => {
    if (window.confirm(`Are you sure you want to delete this subject? All its resources will remain in storage.`)) {
      setSubjects(prev => prev.filter(s => s.id !== id));
      showNotice('Subject deleted.');
    }
  };

  // 4. RESOURCE OPERATIONS
  const handleSaveResource = (e) => {
    e.preventDefault();
    if (!editingResource) return;

    setResources(prev =>
      prev.map(r => (r.id === editingResource.id ? editingResource : r))
    );
    setEditingResource(null);
    showNotice('Study material updated successfully!');
  };

  const handleDeleteResource = (id) => {
    if (window.confirm('Delete this material?')) {
      setResources(prev => prev.filter(r => r.id !== id));
      showNotice('Material deleted.');
    }
  };

  // 5. FLASHCARD OPERATIONS
  const handleDeleteFlashcard = (id) => {
    setFlashcards(prev => prev.filter(f => f.id !== id));
    showNotice('Flashcard deleted.');
  };

  // 6. CHATROOM BROADCAST
  const handleBroadcastAnnouncement = (e) => {
    e.preventDefault();
    if (!announcementText.trim()) return;

    subjects.forEach(s => {
      sendMessage(`📢 **OFFICIAL ANNOUNCEMENT**: ${announcementText.trim()}`);
    });
    setAnnouncementText('');
    showNotice('Announcement broadcasted to all channels!');
  };

  const handleClearChat = () => {
    if (window.confirm('Clear all chat messages?')) {
      setMessages([]);
      showNotice('Chat history cleared.');
    }
  };

  // 7. RAW JSON DATABASE
  const handleLoadRawJson = () => {
    const data = {
      users,
      subjects,
      resources,
      flashcards,
      tasks,
      userProfile,
    };
    setRawJsonText(JSON.stringify(data, null, 2));
  };

  const handleApplyRawJson = () => {
    try {
      const parsed = JSON.parse(rawJsonText);
      const res = importData(parsed);
      if (res.success) {
        showNotice('Raw database applied successfully! 🎉');
      } else {
        showNotice('Failed: ' + res.error);
      }
    } catch (e) {
      showNotice('Invalid JSON syntax.');
    }
  };

  const showNotice = (msg) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(''), 4000);
  };

  // Filter users
  const filteredUsers = users.filter(u => {
    const matchQuery = !userSearchQuery || u.name.toLowerCase().includes(userSearchQuery.toLowerCase()) || (u.email && u.email.toLowerCase().includes(userSearchQuery.toLowerCase()));
    const matchRole = userRoleFilter === 'all' || u.role === userRoleFilter || (userRoleFilter === 'banned' && u.status === 'banned');
    return matchQuery && matchRole;
  });

  const teachersCount = users.filter(u => u.role === 'teacher').length;
  const bannedCount = users.filter(u => u.status === 'banned').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
            <Terminal className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black tracking-tight">
                Private Developer Control Studio
              </h1>
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-400/30">
                Authorized Admin
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Manage user permissions, ban/promote teachers, customize subjects & database.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentView('dashboard')}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all"
          >
            Back to App View
          </button>
          <button
            onClick={() => {
              setDeveloperMode(false);
              setCurrentView('dashboard');
            }}
            className="px-4 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Lock Studio</span>
          </button>
        </div>
      </div>

      {/* Live Notice Banner */}
      {statusMessage && (
        <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'users', label: '👥 User Directory & Roles', icon: Users, count: users.length },
          { id: 'subjects', label: '🏫 Subject Spaces', icon: Layers, count: subjects.length },
          { id: 'resources', label: '📂 Materials & Notes', icon: FolderOpen, count: resources.length },
          { id: 'flashcards', label: '🗂️ Flashcards & Formulas', icon: BookOpen, count: flashcards.length },
          { id: 'tasks', label: '✅ Tasks & Homework', icon: CheckSquare, count: tasks.length },
          { id: 'chat', label: '💬 Chatroom & Announcements', icon: MessageSquare },
          { id: 'rawjson', label: '⚡ Raw JSON Engine', icon: Database },
          { id: 'security', label: '🔒 Change Master PIN', icon: KeyRound },
        ].map(tab => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                if (tab.id === 'rawjson') handleLoadRawJson();
              }}
              className={`py-3 px-4 font-bold text-xs flex items-center gap-2 border-b-2 whitespace-nowrap transition-all ${
                active
                  ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                  active ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: USERS DIRECTORY & PERMISSIONS */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          
          {/* Top Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Members</span>
              <p className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">{users.length}</p>
            </div>
            <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-[11px] font-bold text-purple-500 uppercase tracking-wider">Teachers / Faculty</span>
              <p className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1">{teachersCount}</p>
            </div>
            <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-[11px] font-bold text-indigo-500 uppercase tracking-wider">Enrolled Students</span>
              <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">{users.length - teachersCount}</p>
            </div>
            <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-[11px] font-bold text-rose-500 uppercase tracking-wider">Banned / Suspended</span>
              <p className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">{bannedCount}</p>
            </div>
          </div>

          {/* Search & Actions Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 flex-1 max-w-lg">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={userSearchQuery}
                  onChange={(e) => setUserSearchQuery(e.target.value)}
                  placeholder="Search user by name or email..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <select
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-200 outline-none"
              >
                <option value="all">All Roles</option>
                <option value="teacher">Teachers Only</option>
                <option value="student">Students Only</option>
                <option value="banned">Banned Users</option>
              </select>
            </div>

            <button
              onClick={() => setIsAddUserModalOpen(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-500/20 flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Member</span>
            </button>
          </div>

          {/* Users Table */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-bold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="p-3.5">Member</th>
                    <th className="p-3.5">Role</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Activity Stats</th>
                    <th className="p-3.5 text-right">Developer Permissions & Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredUsers.map(user => (
                    <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      
                      {/* Name & Avatar */}
                      <td className="p-3.5">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${user.avatarGradient || 'from-indigo-500 to-purple-600'} text-white font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-xs`}>
                            {user.name?.charAt(0)?.toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                              <span>{user.name}</span>
                              {user.role === 'teacher' && (
                                <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-md bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                                  TEACHER
                                </span>
                              )}
                            </p>
                            <p className="text-[11px] text-slate-400 truncate">{user.email || 'student@school.edu'}</p>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="p-3.5">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase ${
                          user.role === 'teacher'
                            ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                            : 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                        }`}>
                          {user.role}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="p-3.5">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase flex items-center gap-1 w-max ${
                          user.status === 'banned'
                            ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400'
                            : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'banned' ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                          <span>{user.status === 'banned' ? 'BANNED' : 'ACTIVE'}</span>
                        </span>
                      </td>

                      {/* Stats */}
                      <td className="p-3.5 text-slate-500 text-[11px]">
                        <div>{user.uploadsCount || 0} uploads</div>
                        <div className="text-slate-400">{user.messagesCount || 0} messages</div>
                      </td>

                      {/* Actions: Make Teacher, Ban, Edit, Delete */}
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          
                          {/* Role toggle button */}
                          {user.role === 'teacher' ? (
                            <button
                              onClick={() => handleDemoteStudent(user.id, user.name)}
                              className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-[11px] transition-colors"
                              title="Demote to Student"
                            >
                              Make Student
                            </button>
                          ) : (
                            <button
                              onClick={() => handlePromoteTeacher(user.id, user.name)}
                              className="px-2.5 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 border border-purple-200/60 dark:border-purple-800/60 text-purple-700 dark:text-purple-300 font-bold text-[11px] flex items-center gap-1 transition-colors"
                              title="Promote to Teacher"
                            >
                              <GraduationCap className="w-3.5 h-3.5" />
                              <span>Make Teacher</span>
                            </button>
                          )}

                          {/* Ban / Unban button */}
                          <button
                            onClick={() => handleBanToggle(user)}
                            className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition-colors flex items-center gap-1 ${
                              user.status === 'banned'
                                ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 border border-emerald-300'
                                : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 hover:bg-rose-100 border border-rose-200'
                            }`}
                            title={user.status === 'banned' ? 'Unban User' : 'Ban User'}
                          >
                            <Ban className="w-3.5 h-3.5" />
                            <span>{user.status === 'banned' ? 'Unban' : 'Ban'}</span>
                          </button>

                          {/* Edit User Button */}
                          <button
                            onClick={() => setEditingUser(user)}
                            className="p-1.5 rounded-xl text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                            title="Edit User Info"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete Account */}
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete user account "${user.name}"?`)) {
                                deleteUser(user.id);
                                showNotice(`User ${user.name} removed.`);
                              }
                            }}
                            className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 transition-colors"
                            title="Delete Account"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Add User Modal */}
          {isAddUserModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
              <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                  Add New Classroom Member
                </h3>

                <form onSubmit={handleCreateUser} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={newUserName}
                      onChange={(e) => setNewUserName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-100 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                      placeholder="e.g. rahul@school.edu"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Role Permission</label>
                    <select
                      value={newUserRole}
                      onChange={(e) => setNewUserRole(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-100 outline-none"
                    >
                      <option value="student">Student (Standard Access)</option>
                      <option value="teacher">Teacher (Faculty / Authority Badge)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Status Message / Bio</label>
                    <input
                      type="text"
                      value={newUserStatusText}
                      onChange={(e) => setNewUserStatusText(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 outline-none"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-3">
                    <button
                      type="button"
                      onClick={() => setIsAddUserModalOpen(false)}
                      className="px-4 py-2 text-xs font-bold text-slate-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700"
                    >
                      Add Member
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Edit User Modal */}
          {editingUser && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
              <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                  Edit Member: {editingUser.name}
                </h3>

                <form onSubmit={handleSaveUser} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Name</label>
                    <input
                      type="text"
                      required
                      value={editingUser.name}
                      onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-100 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Email</label>
                    <input
                      type="email"
                      value={editingUser.email || ''}
                      onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Role</label>
                      <select
                        value={editingUser.role}
                        onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 outline-none"
                      >
                        <option value="student">Student</option>
                        <option value="teacher">Teacher</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Status</label>
                      <select
                        value={editingUser.status}
                        onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 outline-none"
                      >
                        <option value="active">Active</option>
                        <option value="banned">Banned</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-3">
                    <button
                      type="button"
                      onClick={() => setEditingUser(null)}
                      className="px-4 py-2 text-xs font-bold text-slate-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>
      )}

      {/* TAB 2: SUBJECTS MANAGER */}
      {activeTab === 'subjects' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map(sub => (
              <div
                key={sub.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className={`h-12 rounded-xl bg-gradient-to-r ${sub.gradient} p-3 text-white flex items-center justify-between`}>
                    <span className="font-extrabold text-sm">{sub.name}</span>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-black/20 rounded-md">{sub.code}</span>
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-2">
                    {sub.description}
                  </p>

                  <div className="text-[11px] text-slate-400 space-y-0.5 pt-1">
                    <p>Instructor: <strong className="text-slate-700 dark:text-slate-300">{sub.teacher}</strong></p>
                    <p>Room: {sub.room}</p>
                    <p>Topics: {sub.topics?.length || 0} chapters defined</p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => handleDeleteSubject(sub.id)}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    title="Delete subject space"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setEditingSubject(sub)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold text-xs hover:bg-indigo-100 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Space</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Subject Edit Form Modal */}
          {editingSubject && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
              <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 max-h-[85vh] overflow-y-auto">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                  Edit Subject Space: {editingSubject.name}
                </h3>

                <form onSubmit={handleSaveSubject} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Subject Name</label>
                    <input
                      type="text"
                      required
                      value={editingSubject.name}
                      onChange={(e) => setEditingSubject({ ...editingSubject, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-100 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Code</label>
                      <input
                        type="text"
                        value={editingSubject.code}
                        onChange={(e) => setEditingSubject({ ...editingSubject, code: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Teacher</label>
                      <input
                        type="text"
                        value={editingSubject.teacher}
                        onChange={(e) => setEditingSubject({ ...editingSubject, teacher: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Description</label>
                    <textarea
                      rows={2}
                      value={editingSubject.description}
                      onChange={(e) => setEditingSubject({ ...editingSubject, description: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Chapter Topics (Comma separated)</label>
                    <textarea
                      rows={3}
                      value={editingSubject.topics?.join(', ')}
                      onChange={(e) => setEditingSubject({ ...editingSubject, topics: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 outline-none"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-3">
                    <button
                      type="button"
                      onClick={() => setEditingSubject(null)}
                      className="px-4 py-2 text-xs font-bold text-slate-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: RESOURCES MANAGER */}
      {activeTab === 'resources' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-bold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="p-3.5">Title</th>
                    <th className="p-3.5">Type</th>
                    <th className="p-3.5">Subject</th>
                    <th className="p-3.5">Topic</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {resources.map(res => (
                    <tr key={res.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="p-3.5 font-bold text-slate-800 dark:text-slate-200 max-w-xs truncate">
                        {res.title}
                      </td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 font-semibold uppercase text-[10px]">
                          {res.type}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-500 capitalize">
                        {res.subjectId}
                      </td>
                      <td className="p-3.5 text-slate-400 max-w-[150px] truncate">
                        {res.topic}
                      </td>
                      <td className="p-3.5 text-right space-x-2">
                        <button
                          onClick={() => setEditingResource(res)}
                          className="text-indigo-600 hover:underline font-bold"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteResource(res.id)}
                          className="text-rose-500 hover:underline font-bold"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Resource Edit Form Modal */}
          {editingResource && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
              <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 max-h-[85vh] overflow-y-auto">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                  Edit Material: {editingResource.title}
                </h3>

                <form onSubmit={handleSaveResource} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Title</label>
                    <input
                      type="text"
                      required
                      value={editingResource.title}
                      onChange={(e) => setEditingResource({ ...editingResource, title: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-100 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Description</label>
                    <textarea
                      rows={2}
                      value={editingResource.description}
                      onChange={(e) => setEditingResource({ ...editingResource, description: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">URL / Link</label>
                    <input
                      type="text"
                      value={editingResource.url}
                      onChange={(e) => setEditingResource({ ...editingResource, url: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Markdown / Formula Notes</label>
                    <textarea
                      rows={4}
                      value={editingResource.textContent || ''}
                      onChange={(e) => setEditingResource({ ...editingResource, textContent: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono text-slate-800 dark:text-slate-100 outline-none"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-3">
                    <button
                      type="button"
                      onClick={() => setEditingResource(null)}
                      className="px-4 py-2 text-xs font-bold text-slate-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: FLASHCARDS */}
      {activeTab === 'flashcards' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {flashcards.map(fc => (
              <div
                key={fc.id}
                className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] text-indigo-600 font-bold mb-1">
                    <span className="uppercase">{fc.subjectId}</span>
                    <span>{fc.topic}</span>
                  </div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-100 mb-1">
                    Q: {fc.question}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl whitespace-pre-wrap">
                    A: {fc.answer}
                  </p>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => handleDeleteFlashcard(fc.id)}
                    className="text-xs text-rose-500 hover:underline font-bold flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Card</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: CHAT & BROADCAST */}
      {activeTab === 'chat' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Broadcast Official Announcement
            </h3>
            <form onSubmit={handleBroadcastAnnouncement} className="space-y-2">
              <textarea
                rows={2}
                required
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                placeholder="Post teacher announcement to all classroom channels..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm"
              >
                Send Broadcast
              </button>
            </form>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                Clear Chat History
              </h4>
              <p className="text-[11px] text-slate-400">
                Wipe all study group messages
              </p>
            </div>
            <button
              onClick={handleClearChat}
              className="px-4 py-2 bg-rose-50 dark:bg-rose-950/40 text-rose-600 border border-rose-200 dark:border-rose-900 rounded-xl text-xs font-bold"
            >
              Clear Messages
            </button>
          </div>
        </div>
      )}

      {/* TAB 6: RAW JSON ENGINE */}
      {activeTab === 'rawjson' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Raw JSON Database Editor
              </h3>
              <p className="text-xs text-slate-400">
                Directly view and edit the entire schema, users, and dataset
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleLoadRawJson}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200"
              >
                Reload JSON
              </button>
              <button
                onClick={handleApplyRawJson}
                className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold shadow-sm flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Apply Database Changes</span>
              </button>
            </div>
          </div>

          <textarea
            rows={18}
            value={rawJsonText}
            onChange={(e) => setRawJsonText(e.target.value)}
            className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-950 text-emerald-400 font-mono text-xs outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      )}

      {/* TAB 7: CHANGE MASTER PIN */}
      {activeTab === 'security' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 max-w-md">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
              Change Developer Master PIN
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Set a new private master password for developer studio access.
            </p>
          </div>

          <form onSubmit={handleChangePin} className="space-y-3 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">New Master PIN</label>
              <input
                type="password"
                required
                value={newMasterPin}
                onChange={(e) => setNewMasterPin(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono text-slate-800 dark:text-slate-100 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Confirm New PIN</label>
              <input
                type="password"
                required
                value={confirmMasterPin}
                onChange={(e) => setConfirmMasterPin(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono text-slate-800 dark:text-slate-100 outline-none"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-sm transition-all"
            >
              Update Master PIN
            </button>
          </form>
        </div>
      )}

    </div>
  );
}
