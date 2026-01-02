"use client";

import { useState } from "react";
import {
  BookOpen,
  Volume2,
  Video,
  Quote,
  HelpCircle,
  ChevronRight,
} from "lucide-react";
import { PronunciationGuide } from "./learn/PronunciationGuide";
import { MantraMeanings } from "./learn/MantraMeanings";
import { VideoTutorials } from "./learn/VideoTutorials";
import { SpiritualQuotes } from "./learn/SpiritualQuotes";
import { FAQSection } from "./learn/FAQSection";

type Section = "pronunciation" | "meanings" | "videos" | "quotes" | "faq";

export function LearningResources() {
  const [activeSection, setActiveSection] = useState<Section>("pronunciation");

  const sections = [
    {
      id: "pronunciation" as Section,
      icon: Volume2,
      title: "Pronunciation Guides",
      description: "Learn the correct way to pronounce sacred mantras",
      color: "from-blue-500 to-blue-600",
    },
    {
      id: "meanings" as Section,
      icon: BookOpen,
      title: "Mantra Meanings",
      description: "Deep dive into the spiritual significance of each mantra",
      color: "from-purple-500 to-purple-600",
    },
    {
      id: "videos" as Section,
      icon: Video,
      title: "Video Tutorials",
      description: "Watch and learn from expert teachings",
      color: "from-red-500 to-red-600",
    },
    {
      id: "quotes" as Section,
      icon: Quote,
      title: "Spiritual Quotes",
      description: "Inspirational teachings and wisdom",
      color: "from-green-500 to-green-600",
    },
    {
      id: "faq" as Section,
      icon: HelpCircle,
      title: "FAQ",
      description: "Common questions and answers",
      color: "from-orange-500 to-orange-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        {/* Header */}
        <div className="text-center mb-12 animate-fadeIn">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 dark:from-amber-400 dark:via-orange-400 dark:to-amber-500 mb-4">
            Learning Resources
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Deepen your understanding and enhance your spiritual practice with
            comprehensive learning materials
          </p>
        </div>

        {/* Section Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`group relative overflow-hidden rounded-2xl p-6 text-left transition-all duration-300 transform hover:scale-105 ${
                  isActive
                    ? `bg-gradient-to-br ${section.color} text-white shadow-2xl`
                    : "bg-white dark:bg-gray-800 text-gray-800 dark:text-white shadow-lg hover:shadow-xl"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`p-3 rounded-xl ${
                      isActive
                        ? "bg-white/20"
                        : `bg-gradient-to-br ${section.color} text-white`
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3
                      className={`text-xl font-bold mb-2 ${
                        isActive ? "text-white" : ""
                      }`}
                    >
                      {section.title}
                    </h3>
                    <p
                      className={`text-sm ${
                        isActive
                          ? "text-white/90"
                          : "text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      {section.description}
                    </p>
                  </div>
                  <ChevronRight
                    className={`w-5 h-5 transition-transform duration-300 ${
                      isActive
                        ? "text-white rotate-90"
                        : "text-gray-400 group-hover:translate-x-1"
                    }`}
                  />
                </div>
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30"></div>
                )}
              </button>
            );
          })}
        </div>

        {/* Active Section Content */}
        <div className="animate-fadeIn">
          {activeSection === "pronunciation" && <PronunciationGuide />}
          {activeSection === "meanings" && <MantraMeanings />}
          {activeSection === "videos" && <VideoTutorials />}
          {activeSection === "quotes" && <SpiritualQuotes />}
          {activeSection === "faq" && <FAQSection />}
        </div>
      </div>
    </div>
  );
}
