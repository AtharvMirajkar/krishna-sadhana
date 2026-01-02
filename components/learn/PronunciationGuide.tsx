"use client";

import { useState } from "react";
import { Volume2, Play, Pause } from "lucide-react";

interface PronunciationItem {
  mantra: string;
  sanskrit: string;
  transliteration: string;
  pronunciation: string;
  audioUrl?: string;
  tips: string[];
}

const pronunciationData: PronunciationItem[] = [
  {
    mantra: "Hare Krishna",
    sanskrit: "हरे कृष्ण",
    transliteration: "Hare Kṛṣṇa",
    pronunciation: "HA-rey KRISH-na",
    tips: [
      "Emphasize the 'HA' sound at the beginning",
      "The 'e' in Hare is pronounced like 'ay' in 'say'",
      "Krishna is pronounced with a soft 'sh' sound",
      "Practice with a steady rhythm",
    ],
  },
  {
    mantra: "Hare Rama",
    sanskrit: "हरे राम",
    transliteration: "Hare Rāma",
    pronunciation: "HA-rey RA-ma",
    tips: [
      "Similar to Hare Krishna, emphasize 'HA'",
      "Rama has a long 'a' sound",
      "Keep the rhythm consistent",
      "Focus on the vibration of each syllable",
    ],
  },
  {
    mantra: "Om Namo Bhagavate Vasudevaya",
    sanskrit: "ॐ नमो भगवते वासुदेवाय",
    transliteration: "Oṃ Namo Bhagavate Vāsudevāya",
    pronunciation: "OM NA-mo BHA-ga-va-te VA-su-de-va-ya",
    tips: [
      "Start with 'OM' - a deep, resonant sound",
      "Break it into syllables for easier learning",
      "Each syllable should be clear and distinct",
      "Practice slowly, then increase speed",
    ],
  },
  {
    mantra: "Govinda Jaya Jaya",
    sanskrit: "गोविन्द जय जय",
    transliteration: "Govinda Jaya Jaya",
    pronunciation: "GO-vin-da JA-ya JA-ya",
    tips: [
      "Govinda has three clear syllables",
      "Jaya is repeated twice with emphasis",
      "Maintain enthusiasm in your voice",
      "Feel the joy in the repetition",
    ],
  },
  {
    mantra: "Radhe Radhe",
    sanskrit: "राधे राधे",
    transliteration: "Rādhe Rādhe",
    pronunciation: "RA-dhe RA-dhe",
    tips: [
      "Simple two-syllable mantra",
      "The 'dh' sound is soft, like 'the'",
      "Repeat with devotion and love",
      "Feel the connection with each repetition",
    ],
  },
];

export function PronunciationGuide() {
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);

  const handlePlay = (index: number) => {
    if (playingIndex === index) {
      setPlayingIndex(null);
    } else {
      setPlayingIndex(index);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg text-white">
            <Volume2 className="w-6 h-6" />
          </div>
          Pronunciation Guide
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Master the correct pronunciation of sacred mantras with detailed
          guides and tips
        </p>
      </div>

      <div className="space-y-6">
        {pronunciationData.map((item, index) => (
          <div
            key={index}
            className="border-2 border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:border-blue-400 dark:hover:border-blue-600 transition-all duration-300 hover:shadow-lg"
          >
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                  {item.mantra}
                </h3>
                <div className="space-y-2 mb-4">
                  <p className="text-3xl font-semibold text-blue-600 dark:text-blue-400">
                    {item.sanskrit}
                  </p>
                  <p className="text-lg text-gray-600 dark:text-gray-400 italic">
                    {item.transliteration}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Pronunciation:
                    </span>
                    <span className="text-lg font-bold text-amber-600 dark:text-amber-400">
                      {item.pronunciation}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => handlePlay(index)}
                className="flex-shrink-0 p-4 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                {playingIndex === index ? (
                  <Pause className="w-6 h-6" />
                ) : (
                  <Play className="w-6 h-6" />
                )}
              </button>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-3">
                Pronunciation Tips:
              </h4>
              <ul className="space-y-2">
                {item.tips.map((tip, tipIndex) => (
                  <li
                    key={tipIndex}
                    className="flex items-start gap-2 text-gray-700 dark:text-gray-300"
                  >
                    <span className="text-blue-500 dark:text-blue-400 mt-1">
                      •
                    </span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-6 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
        <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
          💡 General Tips for Mantra Chanting
        </h4>
        <ul className="space-y-2 text-gray-700 dark:text-gray-300">
          <li>• Start slowly and focus on clarity rather than speed</li>
          <li>
            • Practice regularly to develop muscle memory for pronunciation
          </li>
          <li>• Listen to authentic recordings when available</li>
          <li>• Pay attention to the vibration and resonance of each sound</li>
          <li>• Chant with devotion and mindfulness, not just mechanically</li>
        </ul>
      </div>
    </div>
  );
}
