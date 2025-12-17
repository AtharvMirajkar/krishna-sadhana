'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Mantras page error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
          Something went wrong!
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {error.message || 'Failed to load mantras'}
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-200"
          >
            Try again
          </button>
          <Link
            href="/"
            className="px-6 py-3 bg-white dark:bg-gray-800 text-amber-600 dark:text-amber-400 font-semibold rounded-lg border-2 border-amber-500 hover:shadow-lg transition-all duration-200"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

