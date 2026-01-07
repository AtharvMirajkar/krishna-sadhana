"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, Sparkles, Edit2, Check, X, StickyNote, MessageSquare } from "lucide-react";
import { formatDate } from "@/lib/utils";
import {
  getMantras,
  getChantingRecords,
  upsertChantingRecord,
  getChantingNotes,
  createChantingNote,
  type Mantra,
  type ChantingNote,
} from "@/lib/api";
import { useAuth } from "./AuthProvider";
import { MantraLibrarySkeleton } from "./skeleton";

export function MantraLibrary() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [mantras, setMantras] = useState<Mantra[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chantingRecords, setChantingRecords] = useState<
    Record<string, number>
  >({});
  const [incrementingMantra, setIncrementingMantra] = useState<string | null>(
    null
  );
  const [editingMantra, setEditingMantra] = useState<string | null>(null);
  const [updatingMantra, setUpdatingMantra] = useState<string | null>(null);
  const [countInputs, setCountInputs] = useState<Record<string, string>>({});
  const [chantingNotes, setChantingNotes] = useState<Record<string, ChantingNote[]>>({});
  const [addingNote, setAddingNote] = useState<string | null>(null);
  const [noteInputs, setNoteInputs] = useState<Record<string, string>>({});

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

      const today = formatDate(new Date());

      const [mantrasData, recordsData, notesData] = await Promise.all([
        getMantras(),
        getChantingRecords(user.id, { chantDate: today }),
        getChantingNotes(user.id, { chantDate: today }),
      ]);

      setMantras(mantrasData);

      const records: Record<string, number> = {};
      recordsData.forEach((record) => {
        records[record.mantra_id] = record.chant_count;
      });
      setChantingRecords(records);

      const notes: Record<string, ChantingNote[]> = {};
      notesData.forEach((note) => {
        if (!notes[note.mantra_id]) {
          notes[note.mantra_id] = [];
        }
        notes[note.mantra_id].push(note);
      });
      setChantingNotes(notes);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [loadData, user]);

  const incrementChant = useCallback(
    async (mantraId: string) => {
      if (incrementingMantra || !user) return;

      setIncrementingMantra(mantraId);

      try {
        const today = formatDate(new Date());
        const currentCount = chantingRecords[mantraId] || 0;
        const newCount = currentCount + 1;

        // Optimistic update
        setChantingRecords((prev) => ({
          ...prev,
          [mantraId]: newCount,
        }));

        await upsertChantingRecord({
          mantra_id: mantraId,
          user_id: user.id,
          chant_date: today,
          chant_count: newCount,
        });
      } catch (err) {
        console.error("Error incrementing chant:", err);
        // Revert optimistic update
        setChantingRecords((prev) => ({
          ...prev,
          [mantraId]: (prev[mantraId] || 1) - 1,
        }));
      } finally {
        setTimeout(() => setIncrementingMantra(null), 300);
      }
    },
    [chantingRecords, incrementingMantra, user]
  );

  const setChantCount = useCallback(
    async (mantraId: string, count: number) => {
      if (!user || updatingMantra === mantraId) return;

      // Ensure we're editing the correct mantra
      if (editingMantra !== mantraId) return;

      // Validate count
      if (count < 0 || !Number.isInteger(count)) {
        return;
      }

      const oldCount = chantingRecords[mantraId] || 0;
      setUpdatingMantra(mantraId);

      try {
        const today = formatDate(new Date());

        // Optimistic update
        setChantingRecords((prev) => ({
          ...prev,
          [mantraId]: count,
        }));

        await upsertChantingRecord({
          mantra_id: mantraId,
          user_id: user.id,
          chant_date: today,
          chant_count: count,
        });

        // Clear input and close edit mode
        setCountInputs((prev) => {
          const newInputs = { ...prev };
          delete newInputs[mantraId];
          return newInputs;
        });
        setEditingMantra(null);
      } catch (err) {
        console.error("Error setting chant count:", err);
        // Revert optimistic update
        setChantingRecords((prev) => ({
          ...prev,
          [mantraId]: oldCount,
        }));
      } finally {
        setUpdatingMantra(null);
      }
    },
    [chantingRecords, editingMantra, updatingMantra, user]
  );

  const handleInputChange = (mantraId: string, value: string) => {
    // Only allow positive integers
    if (value === "" || /^\d+$/.test(value)) {
      setCountInputs((prev) => ({
        ...prev,
        [mantraId]: value,
      }));
    }
  };

  const handleEditClick = (mantraId: string) => {
    const currentCount = chantingRecords[mantraId] || 0;
    setCountInputs((prev) => ({
      ...prev,
      [mantraId]: currentCount.toString(),
    }));
    setEditingMantra(mantraId);
  };

  const handleCancelEdit = (mantraId: string) => {
    setCountInputs((prev) => {
      const newInputs = { ...prev };
      delete newInputs[mantraId];
      return newInputs;
    });
    setEditingMantra(null);
  };

  const handleAddNote = useCallback(async (mantraId: string) => {
    if (addingNote || !user) return;

    const note = noteInputs[mantraId]?.trim();
    if (!note) return;

    setAddingNote(mantraId);

    try {
      const today = formatDate(new Date());
      const newNote = await createChantingNote({
        mantra_id: mantraId,
        user_id: user.id,
        chant_date: today,
        note,
      });

      setChantingNotes(prev => ({
        ...prev,
        [mantraId]: [...(prev[mantraId] || []), newNote],
      }));

      setNoteInputs(prev => {
        const newInputs = { ...prev };
        delete newInputs[mantraId];
        return newInputs;
      });
    } catch (err) {
      console.error("Error adding note:", err);
    } finally {
      setAddingNote(null);
    }
  }, [addingNote, noteInputs, user]);

  const handleNoteInputChange = useCallback((mantraId: string, value: string) => {
    setNoteInputs(prev => ({
      ...prev,
      [mantraId]: value,
    }));
  }, []);

  const cancelAddNote = useCallback((mantraId: string) => {
    setNoteInputs(prev => {
      const newInputs = { ...prev };
      delete newInputs[mantraId];
      return newInputs;
    });
  }, []);

  const handleSubmitCount = (mantraId: string) => {
    const inputValue = countInputs[mantraId];
    if (inputValue === undefined || inputValue === "") {
      handleCancelEdit(mantraId);
      return;
    }
    const count = parseInt(inputValue, 10);
    if (!isNaN(count) && count >= 0) {
      setChantCount(mantraId, count);
    }
  };

  // Show loading while checking auth
  if (authLoading) {
    return <MantraLibrarySkeleton />;
  }

  // Don't render anything if not authenticated (will redirect)
  if (!user) {
    return null;
  }

  if (loading) {
    return <MantraLibrarySkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-xl text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={loadData}
            className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        <div className="text-center mb-12 animate-fadeIn">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 dark:from-amber-400 dark:via-orange-400 dark:to-amber-500 mb-4">
            Sacred Mantra Library
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Chant these divine mantras and track your spiritual progress
          </p>
        </div>

        <div className="space-y-6">
          {mantras.map((mantra, index) => (
            <div
              key={mantra.id}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden animate-slideUp"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
                        {mantra.name}
                      </h2>
                      <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 text-sm font-medium rounded-full">
                        {mantra.category}
                      </span>
                    </div>

                    <div className="space-y-3 text-gray-600 dark:text-gray-300">
                      <p className="text-xl font-medium text-amber-600 dark:text-amber-400">
                        {mantra.sanskrit}
                      </p>
                      <p className="italic text-lg">{mantra.transliteration}</p>
                      <p className="text-base leading-relaxed">
                        {mantra.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-4 min-w-[140px]">
                    <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl p-6 text-center shadow-lg w-full">
                      <div className="text-white text-4xl font-bold mb-1">
                        {chantingRecords[mantra.id] || 0}
                      </div>
                      <div className="text-white text-sm font-medium">
                        Today&apos;s Count
                      </div>
                    </div>

                    <button
                      onClick={() => incrementChant(mantra.id)}
                      disabled={
                        incrementingMantra === mantra.id ||
                        editingMantra === mantra.id ||
                        updatingMantra === mantra.id
                      }
                      className={`w-full px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                        incrementingMantra === mantra.id
                          ? "scale-110 animate-pulse"
                          : "hover:scale-105"
                      }`}
                    >
                      <Plus className="w-5 h-5" />
                      Chant
                    </button>

                    {editingMantra === mantra.id ? (
                      <div className="w-full space-y-2 animate-fadeIn">
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            inputMode="numeric"
                            value={countInputs[mantra.id] || ""}
                            onChange={(e) =>
                              handleInputChange(mantra.id, e.target.value)
                            }
                            onKeyDown={(e) => {
                              if (
                                e.key === "Enter" &&
                                updatingMantra !== mantra.id
                              ) {
                                handleSubmitCount(mantra.id);
                              } else if (
                                e.key === "Escape" &&
                                updatingMantra !== mantra.id
                              ) {
                                handleCancelEdit(mantra.id);
                              }
                            }}
                            autoFocus
                            disabled={updatingMantra === mantra.id}
                            className="flex-1 px-4 py-2 border-2 border-amber-400 dark:border-amber-500 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white font-semibold text-center focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                            placeholder="Enter count"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSubmitCount(mantra.id)}
                            disabled={
                              editingMantra !== mantra.id ||
                              updatingMantra === mantra.id
                            }
                            className={`flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                              updatingMantra === mantra.id
                                ? "animate-pulse"
                                : "hover:scale-105"
                            }`}
                          >
                            <Check className="w-4 h-4" />
                            {updatingMantra === mantra.id
                              ? "Setting..."
                              : "Set"}
                          </button>
                          <button
                            onClick={() => handleCancelEdit(mantra.id)}
                            disabled={updatingMantra === mantra.id}
                            className="flex-1 px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <X className="w-4 h-4" />
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleEditClick(mantra.id)}
                        disabled={editingMantra !== null}
                        className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Edit2 className="w-4 h-4" />
                        Set Count
                      </button>
                    )}
                  </div>
                </div>

                {/* Notes Section */}
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Session Notes
                      </span>
                    </div>
                    {noteInputs[mantra.id] ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAddNote(mantra.id)}
                          disabled={addingNote === mantra.id}
                          className="px-3 py-1 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-medium rounded hover:shadow transition-all duration-200 disabled:opacity-50"
                        >
                          {addingNote === mantra.id ? "Saving..." : "Save"}
                        </button>
                        <button
                          onClick={() => cancelAddNote(mantra.id)}
                          disabled={addingNote === mantra.id}
                          className="px-3 py-1 bg-gray-500 text-white text-xs font-medium rounded hover:bg-gray-600 transition-all duration-200 disabled:opacity-50"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleNoteInputChange(mantra.id, "")}
                        className="px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs font-medium rounded hover:shadow transition-all duration-200 flex items-center gap-1"
                      >
                        <StickyNote className="w-3 h-3" />
                        Add Note
                      </button>
                    )}
                  </div>

                  {noteInputs[mantra.id] && (
                    <div className="mb-3 animate-fadeIn">
                      <textarea
                        value={noteInputs[mantra.id]}
                        onChange={(e) => handleNoteInputChange(mantra.id, e.target.value)}
                        placeholder="How did this chanting session make you feel? Any insights or reflections..."
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                        disabled={addingNote === mantra.id}
                      />
                    </div>
                  )}

                  {/* Display existing notes */}
                  {chantingNotes[mantra.id] && chantingNotes[mantra.id].length > 0 && (
                    <div className="space-y-2">
                      {chantingNotes[mantra.id].map((note, index) => (
                        <div key={note.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            {note.note}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {new Date(note.created_at).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {(!chantingNotes[mantra.id] || chantingNotes[mantra.id].length === 0) && !noteInputs[mantra.id] && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                      No notes yet. Add a note to reflect on your chanting experience.
                    </p>
                  )}
                </div>

                {mantra.duration_seconds > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <Sparkles className="w-4 h-4" />
                      <span>Duration: {mantra.duration_seconds} seconds</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {mantras.length === 0 && (
          <div className="text-center py-16">
            <p className="text-xl text-gray-500 dark:text-gray-400">
              No mantras found. Please check back later.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
