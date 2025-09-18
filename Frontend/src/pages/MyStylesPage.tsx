import React, { useState, useEffect } from 'react';
import { HeartIcon } from '../components/icons/HeartIcon';
import { Loader } from '../components/Loader';
import { OutfitCard } from '../components/OutfitCard';
import { getOutfitHistory, deleteOutfitHistory } from '../services/historyService';
import type { History } from '../types';

const MyStylesPage: React.FC = () => {
  const [history, setHistory] = useState<History[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const historyData = await getOutfitHistory();
        setHistory(historyData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load saved styles.');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteOutfitHistory(id);
      setHistory(history.filter(item => item._id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete style.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="text-pink-500" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-7xl mx-auto text-center">
        <div className="bg-white dark:bg-gray-800/50 p-8 rounded-2xl shadow-lg">
          <div className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-pink-100 to-violet-100 dark:from-pink-800/50 dark:to-violet-800/50 rounded-full mb-6">
            <HeartIcon isFilled={true} />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500">
            My Saved Styles
          </h1>
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md dark:bg-red-900/30 dark:text-red-300 dark:border-red-600 my-4" role="alert">
              <p className="font-bold">Error</p>
              <p>{error}</p>
            </div>
          )}
          {history.length === 0 ? (
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              You haven't saved any styles yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {history.map(item => (
                <div key={item._id} className="relative group">
                  <OutfitCard
                    outfit={item.outfit}
                    isSaved={true}
                    onToggleSave={() => {}}
                    imageBase64={""} 
                    imageMimeType={""}
                    imageUrl={item.outfit.imageUrl}
                  />
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="absolute top-4 right-4 bg-red-600 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyStylesPage;