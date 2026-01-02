"use client";

import { useState } from "react";
import { Video, Play, ExternalLink, Clock } from "lucide-react";

interface VideoTutorial {
  id: string;
  title: string;
  description: string;
  duration: string;
  thumbnail: string;
  url: string;
  category: string;
  instructor?: string;
}

const videoTutorials: VideoTutorial[] = [
  {
    id: "1",
    title: "Introduction to Mantra Chanting",
    description:
      "Learn the basics of mantra chanting, including proper technique, posture, and mindset for effective practice.",
    duration: "15:30",
    thumbnail: "🎬",
    url: "https://www.youtube.com/watch?v=example1",
    category: "Beginner",
    instructor: "Swami Krishna Das",
  },
  {
    id: "2",
    title: "Hare Krishna Maha Mantra - Complete Guide",
    description:
      "A comprehensive guide to chanting the Hare Krishna Maha Mantra with correct pronunciation and understanding.",
    duration: "22:45",
    thumbnail: "🕉️",
    url: "https://www.youtube.com/watch?v=example2",
    category: "Intermediate",
    instructor: "Gurudev",
  },
  {
    id: "3",
    title: "Japa Meditation Technique",
    description:
      "Master the art of japa meditation using a mala (prayer beads) for focused and effective mantra repetition.",
    duration: "18:20",
    thumbnail: "📿",
    url: "https://www.youtube.com/watch?v=example3",
    category: "Intermediate",
    instructor: "Bhakti Teacher",
  },
  {
    id: "4",
    title: "Kirtan - Group Chanting",
    description:
      "Experience the power of group chanting (kirtan) and learn how to participate in collective spiritual practice.",
    duration: "25:10",
    thumbnail: "🎵",
    url: "https://www.youtube.com/watch?v=example4",
    category: "All Levels",
    instructor: "Kirtan Leader",
  },
  {
    id: "5",
    title: "Understanding Mantra Meanings",
    description:
      "Deep dive into the spiritual meanings and significance of various Krishna mantras for enhanced practice.",
    duration: "30:00",
    thumbnail: "📖",
    url: "https://www.youtube.com/watch?v=example5",
    category: "Advanced",
    instructor: "Spiritual Scholar",
  },
  {
    id: "6",
    title: "Daily Practice Routine",
    description:
      "Learn how to establish and maintain a consistent daily chanting practice that fits into your lifestyle.",
    duration: "12:15",
    thumbnail: "⏰",
    url: "https://www.youtube.com/watch?v=example6",
    category: "Beginner",
    instructor: "Practice Guide",
  },
];

export function VideoTutorials() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = [
    "All",
    "Beginner",
    "Intermediate",
    "Advanced",
    "All Levels",
  ];

  const filteredVideos =
    selectedCategory === "All"
      ? videoTutorials
      : videoTutorials.filter((video) => video.category === selectedCategory);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-red-500 to-red-600 rounded-lg text-white">
            <Video className="w-6 h-6" />
          </div>
          Video Tutorials
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Watch expert teachings and learn proper techniques through video
          tutorials
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
              selectedCategory === category
                ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVideos.map((video) => (
          <div
            key={video.id}
            className="group border-2 border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden hover:border-red-400 dark:hover:border-red-600 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1"
          >
            {/* Thumbnail */}
            <div className="relative bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-900/30 dark:to-orange-900/30 h-48 flex items-center justify-center">
              <div className="text-6xl">{video.thumbnail}</div>
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                <div className="p-4 bg-red-600 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play className="w-8 h-8" />
                </div>
              </div>
              <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {video.duration}
              </div>
              {video.category && (
                <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded font-semibold">
                  {video.category}
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2 line-clamp-2">
                {video.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                {video.description}
              </p>
              {video.instructor && (
                <p className="text-xs text-gray-500 dark:text-gray-500 mb-3">
                  By {video.instructor}
                </p>
              )}
              <a
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 text-sm font-semibold"
              >
                <Play className="w-4 h-4" />
                Watch Tutorial
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {filteredVideos.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            No videos found in this category.
          </p>
        </div>
      )}

      <div className="mt-8 p-6 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-xl border border-red-200 dark:border-red-800">
        <h4 className="font-bold text-red-800 dark:text-red-300 mb-2">
          📺 Note on Video Content
        </h4>
        <p className="text-gray-700 dark:text-gray-300">
          These are example video tutorials. In a production app, you would
          integrate with YouTube API or host your own video content. Each video
          would have actual embedded players, playlists, and progress tracking.
          Consider adding features like video bookmarks, notes, and completion
          certificates.
        </p>
      </div>
    </div>
  );
}
