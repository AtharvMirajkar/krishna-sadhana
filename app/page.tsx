import Link from "next/link";
import { Sparkles, Book, BarChart3, Heart } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZiZDM4YiIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMyIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
          <div className="text-center space-y-8 animate-fadeIn">
            <div className="flex justify-center">
              <div className="relative">
                <Sparkles className="w-24 h-24 text-amber-600 dark:text-amber-400 animate-pulse" />
                <div className="absolute inset-0 bg-amber-400 dark:bg-amber-600 blur-3xl opacity-30 animate-pulse"></div>
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 dark:from-amber-400 dark:via-orange-400 dark:to-amber-500 animate-slideUp">
              Hare Krishna
            </h1>

            <p
              className="text-2xl md:text-3xl text-gray-700 dark:text-gray-300 font-medium animate-slideUp"
              style={{ animationDelay: "0.1s" }}
            >
              Welcome to Your Spiritual Journey
            </p>

            <p
              className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto animate-slideUp"
              style={{ animationDelay: "0.2s" }}
            >
              Immerse yourself in divine chanting, track your spiritual
              progress, and deepen your devotion to Lord Krishna
            </p>

            <div
              className="flex flex-wrap justify-center gap-4 pt-8 animate-slideUp"
              style={{ animationDelay: "0.3s" }}
            >
              <Link
                href="/mantras"
                className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transform transition-all duration-200"
              >
                Explore Mantras
              </Link>
              <Link
                href="/tracker"
                className="px-8 py-4 bg-white dark:bg-gray-800 text-amber-600 dark:text-amber-400 font-semibold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transform transition-all duration-200 border-2 border-amber-500"
              >
                View Progress
              </Link>
            </div>
          </div>

          <div
            className="grid md:grid-cols-3 gap-8 mt-24 animate-fadeIn"
            style={{ animationDelay: "0.4s" }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mb-6">
                <Book className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                Mantra Library
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Access a beautiful collection of sacred Krishna mantras with
                audio playback and detailed meanings
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mb-6">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                Track Progress
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Monitor your daily, weekly, and monthly chanting with beautiful
                visualizations and insights
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mb-6">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                Deepen Devotion
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Cultivate a consistent spiritual practice and strengthen your
                connection with Lord Krishna
              </p>
            </div>
          </div>

          <div
            className="mt-24 text-center animate-fadeIn"
            style={{ animationDelay: "0.5s" }}
          >
            <blockquote className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 italic max-w-3xl mx-auto">
              &quot;Chanting the holy name of Krishna is the most effective
              means of self-realization in this age.&quot;
            </blockquote>
            <p className="mt-4 text-amber-600 dark:text-amber-400 font-semibold">
              - Bhagavad Gita
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
