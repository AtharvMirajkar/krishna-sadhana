"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Sparkles } from "lucide-react";
import { getUserId, formatDate } from "@/lib/utils";
import {
  getMantras,
  getChantingRecords,
  upsertChantingRecord,
  type Mantra,
} from "@/lib/api";

export function MantraLibrary() {
  const [mantras, setMantras] = useState<Mantra[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chantingRecords, setChantingRecords] = useState<
    Record<string, number>
  >({});
  const [incrementingMantra, setIncrementingMantra] = useState<string | null>(
    null
  );

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const userId = getUserId();
      const today = formatDate(new Date());

      const [mantrasData, recordsData] = await Promise.all([
        getMantras(),
        getChantingRecords(userId, { chantDate: today }),
      ]);

      setMantras(mantrasData);

      const records: Record<string, number> = {};
      recordsData.forEach((record) => {
        records[record.mantra_id] = record.chant_count;
      });
      setChantingRecords(records);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const incrementChant = useCallback(
    async (mantraId: string) => {
      if (incrementingMantra) return;

      setIncrementingMantra(mantraId);

      try {
        const userId = getUserId();
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
          user_id: userId,
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
    [chantingRecords, incrementingMantra]
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-500 border-t-transparent"></div>
      </div>
    );
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
                    <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl p-6 text-center shadow-lg">
                      <div className="text-white text-4xl font-bold mb-1">
                        {chantingRecords[mantra.id] || 0}
                      </div>
                      <div className="text-white text-sm font-medium">
                        Today&apos;s Count
                      </div>
                    </div>

                    <button
                      onClick={() => incrementChant(mantra.id)}
                      disabled={incrementingMantra === mantra.id}
                      className={`w-full px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                        incrementingMantra === mantra.id
                          ? "scale-110 animate-pulse"
                          : "hover:scale-105"
                      }`}
                    >
                      <Plus className="w-5 h-5" />
                      Chant
                    </button>
                  </div>
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
