"use client";

import { useState, useEffect, useCallback } from "react";
import { Quote, RefreshCw, Heart, Share2 } from "lucide-react";

interface SpiritualQuote {
  id: string;
  text: string;
  author: string;
  source?: string;
  category: string;
}

const spiritualQuotes: SpiritualQuote[] = [
  {
    id: "1",
    text: "Chanting the holy name of Krishna is the most effective means of self-realization in this age.",
    author: "Bhagavad Gita",
    source: "Ancient Scripture",
    category: "Practice",
  },
  {
    id: "2",
    text: "The holy name of Krishna is not a material sound vibration, nor has it any material contamination. It is not a product of the material world.",
    author: "Srila Prabhupada",
    source: "Bhagavad Gita As It Is",
    category: "Philosophy",
  },
  {
    id: "3",
    text: "By regularly chanting the Hare Krishna maha-mantra, one can be freed from all material contamination and thus qualify to return home, back to Godhead.",
    author: "Kali-santarana Upanishad",
    source: "Vedic Literature",
    category: "Liberation",
  },
  {
    id: "4",
    text: "The process of chanting is so nice that it can be performed anywhere and everywhere. One can chant Hare Krishna even while walking, working, or resting.",
    author: "Srila Prabhupada",
    source: "Teachings",
    category: "Practice",
  },
  {
    id: "5",
    text: "The holy name of Krishna is identical with Krishna Himself. It is not different from Him, and therefore the holy name is as good as Krishna Himself.",
    author: "Caitanya Caritamrta",
    source: "Gaudiya Vaishnava Text",
    category: "Philosophy",
  },
  {
    id: "6",
    text: "One who chants the holy name of the Lord just once can be freed from all sinful reactions, even if he is the most sinful person.",
    author: "Padma Purana",
    source: "Purana",
    category: "Purification",
  },
  {
    id: "7",
    text: "The chanting of the holy name of Krishna expands the blissful ocean of transcendental life. It gives a cooling effect to everyone and enables one to taste full nectar at every step.",
    author: "Caitanya Caritamrta",
    source: "Gaudiya Vaishnava Text",
    category: "Bliss",
  },
  {
    id: "8",
    text: "In this age of Kali, there is no other means, no other means, no other means for self-realization than chanting the holy name, chanting the holy name, chanting the holy name of Lord Hari.",
    author: "Brihan-naradiya Purana",
    source: "Purana",
    category: "Kali Yuga",
  },
  {
    id: "9",
    text: "The holy name of Krishna is the only means to cross over the ocean of material existence. There is no other way.",
    author: "Narada Puritana",
    source: "Purana",
    category: "Liberation",
  },
  {
    id: "10",
    text: "By chanting the holy name of Krishna, one can achieve all perfection. This is the verdict of all scriptures.",
    author: "Srimad Bhagavatam",
    source: "Bhagavata Purana",
    category: "Perfection",
  },
];

export function SpiritualQuotes() {
  const [currentQuote, setCurrentQuote] = useState<SpiritualQuote>(
    spiritualQuotes[0]
  );
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [category, setCategory] = useState<string>("All");

  const categories = [
    "All",
    "Practice",
    "Philosophy",
    "Liberation",
    "Purification",
    "Bliss",
    "Kali Yuga",
    "Perfection",
  ];

  const filteredQuotes =
    category === "All"
      ? spiritualQuotes
      : spiritualQuotes.filter((q) => q.category === category);

  const getRandomQuote = useCallback(() => {
    const availableQuotes =
      category === "All"
        ? spiritualQuotes
        : spiritualQuotes.filter((q) => q.category === category);
    const randomIndex = Math.floor(Math.random() * availableQuotes.length);
    setCurrentQuote(availableQuotes[randomIndex]);
  }, [category]);

  const toggleFavorite = (quoteId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(quoteId)) {
      newFavorites.delete(quoteId);
    } else {
      newFavorites.add(quoteId);
    }
    setFavorites(newFavorites);
  };

  const shareQuote = async () => {
    const text = `"${currentQuote.text}" - ${currentQuote.author}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Spiritual Quote",
          text: text,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(text);
      alert("Quote copied to clipboard!");
    }
  };

  useEffect(() => {
    getRandomQuote();
  }, [getRandomQuote]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg text-white">
            <Quote className="w-6 h-6" />
          </div>
          Spiritual Quotes & Teachings
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Find inspiration and wisdom from sacred texts and spiritual masters
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
              category === cat
                ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Featured Quote Card */}
      <div className="mb-8">
        <div className="relative bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-900/30 dark:via-emerald-900/30 dark:to-teal-900/30 rounded-2xl p-8 md:p-12 border-2 border-green-200 dark:border-green-800">
          <Quote className="absolute top-4 left-4 w-12 h-12 text-green-300 dark:text-green-700 opacity-50" />
          <div className="relative">
            <blockquote className="text-2xl md:text-3xl font-medium text-gray-800 dark:text-white mb-6 leading-relaxed">
              &ldquo;{currentQuote.text}&rdquo;
            </blockquote>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-lg font-semibold text-green-700 dark:text-green-400">
                  — {currentQuote.author}
                </p>
                {currentQuote.source && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {currentQuote.source}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleFavorite(currentQuote.id)}
                  className={`p-3 rounded-lg transition-all duration-200 ${
                    favorites.has(currentQuote.id)
                      ? "bg-red-500 text-white"
                      : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                  }`}
                >
                  <Heart
                    className={`w-5 h-5 ${
                      favorites.has(currentQuote.id) ? "fill-current" : ""
                    }`}
                  />
                </button>
                <button
                  onClick={shareQuote}
                  className="p-3 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200"
                >
                  <Share2 className="w-5 h-5" />
                </button>
                <button
                  onClick={getRandomQuote}
                  className="p-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
                >
                  <RefreshCw className="w-5 h-5" />
                  New Quote
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* All Quotes Grid */}
      <div>
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
          All Quotes ({filteredQuotes.length})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredQuotes.map((quote) => (
            <div
              key={quote.id}
              className="border-2 border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:border-green-400 dark:hover:border-green-600 transition-all duration-300 hover:shadow-lg"
            >
              <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
                &ldquo;{quote.text}&rdquo;
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-green-700 dark:text-green-400">
                    {quote.author}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    {quote.category}
                  </p>
                </div>
                <button
                  onClick={() => toggleFavorite(quote.id)}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    favorites.has(quote.id)
                      ? "text-red-500"
                      : "text-gray-400 hover:text-red-500"
                  }`}
                >
                  <Heart
                    className={`w-4 h-4 ${
                      favorites.has(quote.id) ? "fill-current" : ""
                    }`}
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
