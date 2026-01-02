"use client";

import { useState } from "react";
import { HelpCircle, ChevronDown, ChevronUp } from "lucide-react";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  {
    id: "1",
    question: "How many times should I chant a mantra daily?",
    answer:
      "There's no fixed number, but traditional practice recommends chanting at least 16 rounds (6,912 times) of the Hare Krishna Maha Mantra daily using a japa mala. However, start with what feels comfortable - even 108 times (one round) is beneficial. The key is consistency and devotion rather than quantity.",
    category: "Practice",
  },
  {
    id: "2",
    question: "What is the best time to chant mantras?",
    answer:
      "The most auspicious times are during Brahma Muhurta (early morning, 4-6 AM) and sunset. However, you can chant anytime that works for your schedule. Morning chanting helps set a positive tone for the day, while evening chanting helps purify the mind before rest. The most important thing is to establish a regular routine.",
    category: "Practice",
  },
  {
    id: "3",
    question: "Do I need a japa mala (prayer beads) to chant?",
    answer:
      "While a japa mala is helpful for counting and maintaining focus, it's not strictly necessary. You can chant without beads, use your fingers to count, or use a digital counter. The japa mala serves as a tool to help maintain concentration and track your rounds, but the essence of chanting is in the devotion and attention you bring to it.",
    category: "Practice",
  },
  {
    id: "4",
    question: "Can I chant mantras while doing other activities?",
    answer:
      "Yes! One of the beautiful aspects of mantra chanting is that you can do it while walking, cooking, commuting, or doing simple tasks. However, for deeper practice and meditation, it's best to sit quietly and focus solely on the mantra. A combination of both - focused chanting sessions and chanting during activities - is ideal.",
    category: "Practice",
  },
  {
    id: "5",
    question: "What if I don't know Sanskrit pronunciation?",
    answer:
      "Don't worry! Start with the transliteration (English letters) and focus on chanting with devotion. As you practice, your pronunciation will naturally improve. You can also listen to authentic recordings and follow along. The sincerity of your heart is more important than perfect pronunciation, especially when starting out.",
    category: "Pronunciation",
  },
  {
    id: "6",
    question: "How long does it take to see benefits from chanting?",
    answer:
      "Benefits can be felt immediately in terms of peace and calm, but deeper spiritual transformation is a gradual process. Some people notice positive changes within days or weeks, while others may take months. The key is consistent, regular practice with devotion. Remember, this is a spiritual journey, not a quick fix.",
    category: "Benefits",
  },
  {
    id: "7",
    question: "Can I chant multiple mantras?",
    answer:
      "Yes, you can chant different mantras, but it's generally recommended to focus on one primary mantra for your main practice. The Hare Krishna Maha Mantra is considered the most powerful for this age. You can chant other mantras as supplementary practice, but having a primary focus helps deepen your connection.",
    category: "Practice",
  },
  {
    id: "8",
    question: "What should I do if my mind wanders while chanting?",
    answer:
      "Mind wandering is completely normal, especially when starting. When you notice your mind has drifted, gently bring it back to the mantra without judgment. Don't get frustrated - this is part of the practice. Over time, your concentration will improve. Some practitioners find it helpful to visualize the meaning of the mantra or focus on the sound vibration.",
    category: "Practice",
  },
  {
    id: "9",
    question: "Is there a specific posture for chanting?",
    answer:
      "While sitting in a comfortable cross-legged position with a straight spine is ideal, you can chant in any comfortable position. The important thing is to be relaxed yet alert. You can sit on a chair, cushion, or even lie down if needed. As long as you can maintain focus and avoid falling asleep, the posture can be flexible.",
    category: "Practice",
  },
  {
    id: "10",
    question: "What is the difference between japa and kirtan?",
    answer:
      "Japa is individual, quiet chanting, usually done with a japa mala, focusing on personal meditation. Kirtan is group chanting, often with musical instruments, where people chant together in a call-and-response format. Both are powerful practices - japa for personal depth and kirtan for collective energy and community connection.",
    category: "Practice",
  },
  {
    id: "11",
    question: "Do I need to be vegetarian to chant mantras?",
    answer:
      "No, you don't need to be vegetarian to start chanting. Mantra chanting is open to everyone regardless of diet. However, many practitioners find that a vegetarian diet supports their spiritual practice by promoting clarity and compassion. This is a personal choice that can evolve with your practice.",
    category: "Lifestyle",
  },
  {
    id: "12",
    question: "How do I track my chanting progress?",
    answer:
      "You can track your progress using this app! Record your daily chanting counts, maintain streaks, and monitor your consistency. Many practitioners also keep a simple journal noting their daily rounds, experiences, and insights. The key is finding a method that helps you stay motivated and consistent.",
    category: "Tracking",
  },
];

export function FAQSection() {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = [
    "All",
    "Practice",
    "Pronunciation",
    "Benefits",
    "Lifestyle",
    "Tracking",
  ];

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedIds(newExpanded);
  };

  const filteredFAQs =
    selectedCategory === "All"
      ? faqData
      : faqData.filter((faq) => faq.category === selectedCategory);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg text-white">
            <HelpCircle className="w-6 h-6" />
          </div>
          Frequently Asked Questions
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Find answers to common questions about mantra chanting and spiritual
          practice
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
              selectedCategory === cat
                ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* FAQ List */}
      <div className="space-y-4">
        {filteredFAQs.map((faq) => {
          const isExpanded = expandedIds.has(faq.id);
          return (
            <div
              key={faq.id}
              className="border-2 border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden hover:border-orange-400 dark:hover:border-orange-600 transition-all duration-300"
            >
              <button
                onClick={() => toggleExpand(faq.id)}
                className="w-full p-5 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-start gap-4 flex-1">
                  <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg text-white flex-shrink-0">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">
                      {faq.question}
                    </h3>
                    <span className="text-xs text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30 px-2 py-1 rounded">
                      {faq.category}
                    </span>
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-6 h-6 text-gray-400 flex-shrink-0 ml-4" />
                ) : (
                  <ChevronDown className="w-6 h-6 text-gray-400 flex-shrink-0 ml-4" />
                )}
              </button>

              {isExpanded && (
                <div className="p-5 pt-0 pl-16 animate-fadeIn">
                  <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 border border-orange-200 dark:border-orange-800">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredFAQs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            No FAQs found in this category.
          </p>
        </div>
      )}

      <div className="mt-8 p-6 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
        <h4 className="font-bold text-orange-800 dark:text-orange-300 mb-2">
          💬 Still Have Questions?
        </h4>
        <p className="text-gray-700 dark:text-gray-300">
          If you have questions that aren&apos;t answered here, consider
          reaching out to a spiritual teacher or community. Remember, the
          spiritual path is personal, and what works for one person may differ
          for another. Trust your practice and be patient with yourself.
        </p>
      </div>
    </div>
  );
}
