"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Book,
  Plus,
  Calendar,
  Heart,
  Download,
  Edit,
  Trash2,
  Save,
  X,
  Moon,
  Sun,
  Coffee,
  Smile,
  Meh,
  Frown,
  Sparkles,
  Target,
} from "lucide-react";
import { useAuth } from "./AuthProvider";
import {
  getJournalEntries,
  createJournalEntry,
  updateJournalEntry,
  deleteJournalEntry,
  getMoodEntries,
  upsertMoodEntry,
  deleteMoodEntry,
  type JournalEntry,
  type MoodEntry,
} from "@/lib/api";
import { SpiritualJournalSkeleton } from "./skeleton";

const MOOD_OPTIONS = [
  {
    value: "peaceful" as const,
    label: "Peaceful",
    icon: Moon,
    color: "text-blue-500",
  },
  {
    value: "joyful" as const,
    label: "Joyful",
    icon: Smile,
    color: "text-yellow-500",
  },
  {
    value: "contemplative" as const,
    label: "Contemplative",
    icon: Target,
    color: "text-purple-500",
  },
  {
    value: "challenged" as const,
    label: "Challenged",
    icon: Meh,
    color: "text-orange-500",
  },
  {
    value: "inspired" as const,
    label: "Inspired",
    icon: Sparkles,
    color: "text-pink-500",
  },
  {
    value: "tired" as const,
    label: "Tired",
    icon: Coffee,
    color: "text-gray-500",
  },
  {
    value: "grateful" as const,
    label: "Grateful",
    icon: Heart,
    color: "text-red-500",
  },
  {
    value: "other" as const,
    label: "Other",
    icon: Sun,
    color: "text-green-500",
  },
];

const REFLECTION_PROMPTS = [
  "What did you learn about yourself today?",
  "How did your chanting practice make you feel?",
  "What challenges did you face in your spiritual practice?",
  "What are you grateful for today?",
  "How has Krishna guided you today?",
  "What intention will you set for tomorrow?",
];

export function SpiritualJournal() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [activeTab, setActiveTab] = useState<"entries" | "mood">("entries");
  const [showNewEntryForm, setShowNewEntryForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  // Form states
  const [entryTitle, setEntryTitle] = useState("");
  const [entryContent, setEntryContent] = useState("");
  const [entryTags, setEntryTags] = useState<string[]>([]);
  const [entryReflectionPrompts, setEntryReflectionPrompts] = useState<
    { question: string; answer: string }[]
  >([]);
  const [isPrivate, setIsPrivate] = useState(true);

  // Mood form states
  const [selectedMood, setSelectedMood] =
    useState<MoodEntry["mood"]>("peaceful");
  const [moodIntensity, setMoodIntensity] = useState<number>(3);
  const [moodNote, setMoodNote] = useState("");

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
      return;
    }
  }, [user, authLoading, router]);

  const loadData = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const [entries, moods] = await Promise.all([
        getJournalEntries(user.id, { fromDate: selectedDate }),
        getMoodEntries(user.id, { fromDate: selectedDate }),
      ]);

      setJournalEntries(entries);
      setMoodEntries(moods);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load journal data"
      );
      console.error("Error loading journal data:", err);
    } finally {
      setLoading(false);
    }
  }, [user, selectedDate]);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [loadData, user]);

  const resetForm = () => {
    setEntryTitle("");
    setEntryContent("");
    setEntryTags([]);
    setEntryReflectionPrompts([]);
    setIsPrivate(true);
    setSelectedMood("peaceful");
    setMoodIntensity(3);
    setMoodNote("");
  };

  const handleCreateEntry = async () => {
    if (!user || !entryTitle.trim() || !entryContent.trim()) return;

    try {
      const newEntry = await createJournalEntry({
        user_id: user.id,
        date: selectedDate,
        title: entryTitle.trim(),
        content: entryContent.trim(),
        reflection_prompts: entryReflectionPrompts,
        tags: entryTags,
        is_private: isPrivate,
      });

      setJournalEntries((prev) => [newEntry, ...prev]);
      setShowNewEntryForm(false);
      resetForm();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create journal entry"
      );
    }
  };

  const handleUpdateEntry = async () => {
    if (!editingEntry) return;

    try {
      const updatedEntry = await updateJournalEntry(editingEntry.id, {
        title: entryTitle.trim(),
        content: entryContent.trim(),
        reflection_prompts: entryReflectionPrompts,
        tags: entryTags,
        is_private: isPrivate,
      });

      setJournalEntries((prev) =>
        prev.map((entry) =>
          entry.id === editingEntry.id ? updatedEntry : entry
        )
      );
      setEditingEntry(null);
      resetForm();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update journal entry"
      );
    }
  };

  const handleDeleteEntry = async (entryId: string) => {
    if (!confirm("Are you sure you want to delete this journal entry?")) return;

    try {
      await deleteJournalEntry(entryId);
      setJournalEntries((prev) => prev.filter((entry) => entry.id !== entryId));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete journal entry"
      );
    }
  };

  const handleSaveMood = async () => {
    if (!user) return;

    try {
      const moodEntry = await upsertMoodEntry({
        user_id: user.id,
        date: selectedDate,
        mood: selectedMood,
        intensity: moodIntensity,
        note: moodNote.trim() || undefined,
      });

      setMoodEntries((prev) => {
        const existing = prev.find((m) => m.date === selectedDate);
        if (existing) {
          return prev.map((m) => (m.date === selectedDate ? moodEntry : m));
        } else {
          return [...prev, moodEntry];
        }
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save mood entry"
      );
    }
  };

  const startEditing = (entry: JournalEntry) => {
    setEditingEntry(entry);
    setEntryTitle(entry.title);
    setEntryContent(entry.content);
    setEntryTags(entry.tags || []);
    setEntryReflectionPrompts(entry.reflection_prompts || []);
    setIsPrivate(entry.is_private);
  };

  const cancelEditing = () => {
    setEditingEntry(null);
    resetForm();
  };

  const addReflectionPrompt = () => {
    setEntryReflectionPrompts((prev) => [
      ...prev,
      {
        question:
          REFLECTION_PROMPTS[
            Math.floor(Math.random() * REFLECTION_PROMPTS.length)
          ],
        answer: "",
      },
    ]);
  };

  const updateReflectionPrompt = (index: number, answer: string) => {
    setEntryReflectionPrompts((prev) =>
      prev.map((prompt, i) => (i === index ? { ...prompt, answer } : prompt))
    );
  };

  const removeReflectionPrompt = (index: number) => {
    setEntryReflectionPrompts((prev) => prev.filter((_, i) => i !== index));
  };

  const addTag = (tag: string) => {
    if (tag.trim() && !entryTags.includes(tag.trim())) {
      setEntryTags((prev) => [...prev, tag.trim()]);
    }
  };

  const removeTag = (tagToRemove: string) => {
    setEntryTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  };

  const exportJournal = () => {
    const data = {
      entries: journalEntries,
      moods: moodEntries,
      exportedAt: new Date().toISOString(),
      user: user?.name,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `spiritual-journal-${selectedDate}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Show loading while checking auth
  if (authLoading) {
    return <SpiritualJournalSkeleton />;
  }

  // Don't render anything if not authenticated (will redirect)
  if (!user) {
    return null;
  }

  if (loading) {
    return <SpiritualJournalSkeleton />;
  }

  const todaysMood = moodEntries.find((m) => m.date === selectedDate);
  const todaysEntries = journalEntries.filter((e) => e.date === selectedDate);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        <div className="text-center mb-12 animate-fadeIn">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 dark:from-amber-400 dark:via-orange-400 dark:to-amber-500 mb-4">
            Spiritual Journal
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            Reflect on your spiritual journey and track your inner growth
          </p>

          {/* Date Selector */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
            <button
              onClick={exportJournal}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-200 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center gap-2 mb-8">
            <button
              onClick={() => setActiveTab("entries")}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 ${
                activeTab === "entries"
                  ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg"
                  : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              <Book className="w-4 h-4" />
              Journal Entries
            </button>
            <button
              onClick={() => setActiveTab("mood")}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 ${
                activeTab === "mood"
                  ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg"
                  : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              <Heart className="w-4 h-4" />
              Mood Tracking
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {activeTab === "entries" && (
          <div className="space-y-6">
            {/* New Entry Button */}
            {!showNewEntryForm && !editingEntry && (
              <div className="text-center">
                <button
                  onClick={() => setShowNewEntryForm(true)}
                  className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-200 flex items-center gap-2 mx-auto"
                >
                  <Plus className="w-4 h-4" />
                  New Journal Entry
                </button>
              </div>
            )}

            {/* Journal Entry Form */}
            {(showNewEntryForm || editingEntry) && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 animate-fadeIn">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                    {editingEntry ? "Edit Entry" : "New Journal Entry"}
                  </h2>
                  <button
                    onClick={() => {
                      setShowNewEntryForm(false);
                      cancelEditing();
                    }}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={entryTitle}
                      onChange={(e) => setEntryTitle(e.target.value)}
                      placeholder="What would you like to reflect on today?"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Content
                    </label>
                    <textarea
                      value={entryContent}
                      onChange={(e) => setEntryContent(e.target.value)}
                      placeholder="Share your thoughts, experiences, and spiritual insights..."
                      rows={8}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                    />
                  </div>

                  {/* Reflection Prompts */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Reflection Prompts
                      </label>
                      <button
                        onClick={addReflectionPrompt}
                        className="text-sm px-3 py-1 bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 rounded hover:bg-amber-200 dark:hover:bg-amber-800"
                      >
                        Add Prompt
                      </button>
                    </div>
                    {entryReflectionPrompts.map((prompt, index) => (
                      <div
                        key={index}
                        className="mb-4 p-4 border border-gray-200 dark:border-gray-600 rounded-lg"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 flex-1">
                            {prompt.question}
                          </p>
                          <button
                            onClick={() => removeReflectionPrompt(index)}
                            className="ml-2 text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <textarea
                          value={prompt.answer}
                          onChange={(e) =>
                            updateReflectionPrompt(index, e.target.value)
                          }
                          placeholder="Your reflection..."
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none text-sm"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tags
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {entryTags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 rounded-full text-sm flex items-center gap-1"
                        >
                          {tag}
                          <button
                            onClick={() => removeTag(tag)}
                            className="hover:text-red-500"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <input
                      type="text"
                      placeholder="Add a tag and press Enter"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addTag((e.target as HTMLInputElement).value);
                          (e.target as HTMLInputElement).value = "";
                        }
                      }}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>

                  {/* Privacy */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isPrivate"
                      checked={isPrivate}
                      onChange={(e) => setIsPrivate(e.target.checked)}
                      className="mr-2"
                    />
                    <label
                      htmlFor="isPrivate"
                      className="text-sm text-gray-700 dark:text-gray-300"
                    >
                      Keep this entry private
                    </label>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-4">
                    <button
                      onClick={() => {
                        setShowNewEntryForm(false);
                        cancelEditing();
                      }}
                      className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={
                        editingEntry ? handleUpdateEntry : handleCreateEntry
                      }
                      className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      {editingEntry ? "Update" : "Save"} Entry
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Existing Entries */}
            <div className="space-y-4">
              {todaysEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                        {entry.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(entry.date).toLocaleDateString()}
                        </span>
                        {entry.tags && entry.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {entry.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-1 bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 rounded text-xs"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEditing(entry)}
                        className="p-2 text-gray-500 hover:text-amber-600 dark:hover:text-amber-400"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteEntry(entry.id)}
                        className="p-2 text-gray-500 hover:text-red-600 dark:hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="prose dark:prose-invert max-w-none mb-4">
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {entry.content}
                    </p>
                  </div>

                  {entry.reflection_prompts &&
                    entry.reflection_prompts.length > 0 && (
                      <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                        <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                          Reflections
                        </h4>
                        <div className="space-y-3">
                          {entry.reflection_prompts.map((prompt, index) => (
                            <div
                              key={index}
                              className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
                            >
                              <p className="font-medium text-gray-800 dark:text-white mb-2">
                                {prompt.question}
                              </p>
                              <p className="text-gray-700 dark:text-gray-300 text-sm">
                                {prompt.answer}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              ))}

              {todaysEntries.length === 0 && !showNewEntryForm && (
                <div className="text-center py-12">
                  <Book className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-xl text-gray-500 dark:text-gray-400">
                    No journal entries for{" "}
                    {new Date(selectedDate).toLocaleDateString()}
                  </p>
                  <p className="text-gray-400 dark:text-gray-500 mt-2">
                    Start your spiritual reflection by creating your first entry
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "mood" && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
              How are you feeling today?
            </h2>

            {/* Mood Selection */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {MOOD_OPTIONS.map((mood) => {
                const Icon = mood.icon;
                return (
                  <button
                    key={mood.value}
                    onClick={() => setSelectedMood(mood.value)}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 flex flex-col items-center gap-2 ${
                      selectedMood === mood.value
                        ? "border-amber-500 bg-amber-50 dark:bg-amber-900"
                        : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                    }`}
                  >
                    <Icon className={`w-8 h-8 ${mood.color}`} />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {mood.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Intensity Slider */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Intensity (1-5)
              </label>
              <input
                type="range"
                min="1"
                max="5"
                value={moodIntensity}
                onChange={(e) => setMoodIntensity(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>Mild</span>
                <span className="font-semibold text-amber-600 dark:text-amber-400">
                  {moodIntensity}
                </span>
                <span>Intense</span>
              </div>
            </div>

            {/* Mood Note */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Notes (Optional)
              </label>
              <textarea
                value={moodNote}
                onChange={(e) => setMoodNote(e.target.value)}
                placeholder="Any additional thoughts about your mood..."
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Save Button */}
            <div className="text-center">
              <button
                onClick={handleSaveMood}
                className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-200 flex items-center gap-2 mx-auto"
              >
                <Heart className="w-4 h-4" />
                Save Mood
              </button>
            </div>

            {/* Current Mood Display */}
            {todaysMood && (
              <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                  Today&apos;s Mood
                </h3>
                <div className="flex items-center gap-4">
                  {(() => {
                    const moodOption = MOOD_OPTIONS.find(
                      (m) => m.value === todaysMood.mood
                    );
                    const Icon = moodOption?.icon || Sun;
                    return (
                      <>
                        <Icon
                          className={`w-6 h-6 ${
                            moodOption?.color || "text-gray-500"
                          }`}
                        />
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          {moodOption?.label || todaysMood.mood}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Intensity: {todaysMood.intensity}/5
                        </span>
                      </>
                    );
                  })()}
                </div>
                {todaysMood.note && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    {todaysMood.note}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
