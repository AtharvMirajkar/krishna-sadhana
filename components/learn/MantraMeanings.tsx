"use client";

import { useState } from "react";
import { BookOpen, ChevronDown, ChevronUp, Sparkles } from "lucide-react";

interface MantraMeaning {
  mantraId?: string;
  name: string;
  sanskrit: string;
  meaning: string;
  significance: string;
  benefits: string[];
  usage: string;
}

const mantraMeaningsData: MantraMeaning[] = [
  {
    name: "Hare Krishna Maha Mantra",
    sanskrit:
      "हरे कृष्ण हरे कृष्ण कृष्ण कृष्ण हरे हरे | हरे राम हरे राम राम राम हरे हरे ||",
    meaning:
      "O Lord, O Energy of the Lord, please engage me in Your service. This is the great prayer for deliverance in this age.",
    significance:
      "The Hare Krishna Maha Mantra is considered the most powerful mantra for spiritual purification in Kali Yuga. It directly addresses the Supreme Lord Krishna and His divine energy, Radha (Hare).",
    benefits: [
      "Purifies the heart and mind",
      "Removes material attachments",
      "Develops love for God",
      "Brings peace and tranquility",
      "Connects with divine consciousness",
      "Protects from negative influences",
    ],
    usage:
      "Chant this mantra daily, ideally 16 rounds (6,912 times) on a japa mala, or as many times as possible. It can be chanted anywhere, anytime.",
  },
  {
    name: "Om Namo Bhagavate Vasudevaya",
    sanskrit: "ॐ नमो भगवते वासुदेवाय",
    meaning:
      "I offer my respectful obeisances unto Lord Vasudeva, the son of Vasudeva, who is the Supreme Personality of Godhead.",
    significance:
      "This is one of the most important mantras for worshiping Lord Krishna. It acknowledges Krishna as the Supreme Lord and offers complete surrender.",
    benefits: [
      "Develops devotion and surrender",
      "Removes obstacles in spiritual life",
      "Brings divine protection",
      "Enhances spiritual knowledge",
      "Purifies the consciousness",
    ],
    usage:
      "Chant 108 times daily, especially in the morning. Can be chanted before starting any spiritual activity.",
  },
  {
    name: "Govinda Jaya Jaya",
    sanskrit: "गोविन्द जय जय",
    meaning:
      "All glories to Govinda (Krishna), the protector of the cows and the gopis.",
    significance:
      "This mantra celebrates the victory and glories of Lord Krishna. Govinda means 'one who gives pleasure to the cows and senses'.",
    benefits: [
      "Invokes joy and celebration",
      "Removes depression and anxiety",
      "Brings spiritual ecstasy",
      "Develops gratitude",
      "Connects with Krishna's pastimes",
    ],
    usage:
      "Chant with enthusiasm and joy, especially during kirtan or group chanting. Can be chanted anytime to lift your mood.",
  },
  {
    name: "Radhe Radhe",
    sanskrit: "राधे राधे",
    meaning:
      "Repeatedly calling upon Radha, the divine consort of Krishna and the embodiment of pure love and devotion.",
    significance:
      "This simple yet powerful mantra invokes Radha, who represents the highest form of devotion. Chanting this connects one with the mood of pure love.",
    benefits: [
      "Develops pure love and devotion",
      "Removes material desires",
      "Brings emotional healing",
      "Connects with divine feminine energy",
      "Fosters humility and surrender",
    ],
    usage:
      "Chant with love and devotion, especially when feeling disconnected or in need of emotional support. Very effective for developing bhakti.",
  },
];

export function MantraMeanings() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg text-white">
            <BookOpen className="w-6 h-6" />
          </div>
          Mantra Meanings & Explanations
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Understand the deep spiritual significance and meaning behind each
          sacred mantra
        </p>
      </div>

      <div className="space-y-4">
        {mantraMeaningsData.map((item, index) => {
          const isExpanded = expandedIndex === index;
          return (
            <div
              key={index}
              className="border-2 border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden hover:border-purple-400 dark:hover:border-purple-600 transition-all duration-300"
            >
              <button
                onClick={() => toggleExpand(index)}
                className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg text-white">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                      {item.name}
                    </h3>
                    <p className="text-lg text-purple-600 dark:text-purple-400 mt-1">
                      {item.sanskrit}
                    </p>
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-6 h-6 text-gray-400" />
                ) : (
                  <ChevronDown className="w-6 h-6 text-gray-400" />
                )}
              </button>

              {isExpanded && (
                <div className="p-6 pt-0 space-y-4 animate-fadeIn">
                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                    <h4 className="font-semibold text-purple-800 dark:text-purple-300 mb-2">
                      Meaning:
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300">
                      {item.meaning}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
                      Spiritual Significance:
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      {item.significance}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-white mb-3">
                      Benefits:
                    </h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {item.benefits.map((benefit, benefitIndex) => (
                        <li
                          key={benefitIndex}
                          className="flex items-start gap-2 text-gray-700 dark:text-gray-300"
                        >
                          <span className="text-purple-500 dark:text-purple-400 mt-1">
                            ✓
                          </span>
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
                    <h4 className="font-semibold text-amber-800 dark:text-amber-300 mb-2">
                      How to Use:
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300">
                      {item.usage}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 p-6 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
        <h4 className="font-bold text-purple-800 dark:text-purple-300 mb-2 flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          Understanding Mantras
        </h4>
        <p className="text-gray-700 dark:text-gray-300">
          Mantras are not just words; they are powerful spiritual tools that
          connect us with the divine. Each mantra carries specific vibrations
          and energies that can transform our consciousness. When chanted with
          devotion and understanding, mantras purify the mind, remove obstacles,
          and bring us closer to the Supreme. The meaning and significance help
          us chant with proper intention and focus, making our practice more
          effective and meaningful.
        </p>
      </div>
    </div>
  );
}
