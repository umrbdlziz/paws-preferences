'use client'
import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import axios from 'axios';

// Define a type for a Cat object
interface Cat {
  id: string;
  url: string;
  tags: string[];
  createdAt: string;
  mimeType: string;
}

const CAT_COUNT = 15; // A fixed number of cat pictures (e.g., 10-20)
const NEXT_CATS_PREVIEW_COUNT = 3; // How many upcoming cats to show at the bottom

const Home: React.FC = () => {
  const [cats, setCats] = useState<Cat[]>([]);
  const [likedCats, setLikedCats] = useState<Cat[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [isSwiping, setIsSwiping] = useState(false);

  // Motion values for drag gesture of the main card
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-10, 0, 10]);
  const opacity = useTransform(x, [-150, 0, 150], [0, 1, 0]);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const fetchedCats: Cat[] = [];
        for (let i = 0; i < CAT_COUNT; i++) {
          const response = await axios.get('https://cataas.com/cat?json=true');
          fetchedCats.push(response.data);
        }
        setCats(fetchedCats);
      } catch (error) {
        console.error('Error fetching cats:', error);
        setCats(
          Array(CAT_COUNT).fill(0).map((_, i) => ({
            id: `mock-cat-${i}`,
            url: `https://via.placeholder.com/300x400?text=Cat+${i + 1}`,
            tags: [],
            createdAt: '',
            mimeType: ''
          }))
        );
      }
    };

    fetchCats();
  }, []);

  const handleSwipe = (info: any, cat: Cat) => {
    setIsSwiping(false);
    const direction = info.offset.x > 0 ? 'right' : 'left';
    if (Math.abs(info.offset.x) > 100) {
      if (direction === 'right') {
        setLikedCats((prev) => [...prev, cat]);
      }
      setTimeout(() => {
        setCurrentIndex((prev) => {
          const newIndex = prev + 1;
          if (newIndex >= CAT_COUNT) setShowSummary(true);
          return newIndex;
        });
        x.set(0); // Reset position for next card
      }, 20); // Allow animation to complete
    } else {
      x.set(0);
    }
  };

  const handlePointerDown = () => setIsSwiping(true);

  const handleButtonSwipe = (direction: 'left' | 'right') => {
    const currentCat = cats[currentIndex];
    if (!currentCat) return;
    x.set(direction === 'right' ? 100 : -100);
    if (direction === 'right') {
      setLikedCats((prev) => [...prev, currentCat]);
    }
    setTimeout(() => {
      setCurrentIndex((prev) => {
        const newIndex = prev + 1;
        if (newIndex >= CAT_COUNT) setShowSummary(true);
        return newIndex;
      });
      x.set(0);
    }, 20);
  };

  if (showSummary) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full flex flex-col items-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2 text-center">Your Cat Preferences</h1>
          <p className="text-gray-500 mb-6 text-center">
            You liked <span className="font-semibold">{likedCats.length}</span> out of {CAT_COUNT} cats!
          </p>
          <div className="grid grid-cols-3 gap-3 w-full mb-6">
            {likedCats.length > 0 ? (
              likedCats.map((cat) => (
                <img
                  key={cat.id}
                  src={cat.url}
                  alt="Liked Cat"
                  className="w-full h-24 object-cover rounded-lg shadow"
                />
              ))
            ) : (
              <p className="col-span-3 text-center text-gray-400">No cats liked. Try again!</p>
            )}
          </div>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-6 py-2 bg-gray-800 text-white rounded-full font-semibold shadow hover:bg-gray-700 transition"
          >
            Start Over
          </button>
        </div>
      </div>
    );
  }

  const currentCat = cats[currentIndex];
  const upcomingCats = cats.slice(currentIndex + 1, currentIndex + NEXT_CATS_PREVIEW_COUNT + 1);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 px-4">
      <div className="w-full max-w-xs flex flex-col items-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-2 text-center">Paws & Preferences</h1>
        <p className="text-gray-500 mb-4 text-center">Swipe right if you like the kitty, left if you don't!</p>
        <div className="relative w-full h-[400px] flex justify-center items-center mb-4">

          {/* Main Current Cat Card */}
          {currentCat && (
            <motion.div
              key={currentCat.id}
              className="absolute w-full h-[400px] rounded-2xl bg-cover bg-center shadow-2xl flex items-end justify-center"
              style={{
                backgroundImage: `url(${currentCat.url})`,
                x: x,
                rotate: rotate,
                opacity: opacity,
                zIndex: 2
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
              dragElastic={0.8}
              onDragEnd={(event, info) => handleSwipe(info, currentCat)}
              onPointerDown={handlePointerDown}
              animate={isSwiping ? {} : { x: 0, rotate: 0, opacity: 1, scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div className="w-full flex justify-between items-center px-4 pb-4">
                <span className="bg-black/40 text-white text-xs px-3 py-1 rounded-full">
                  Cat {currentIndex + 1} / {CAT_COUNT}
                </span>
              </div>
            </motion.div>
          )}
          {/* Placeholder if no more cats */}
          {!currentCat && currentIndex < CAT_COUNT && (
            <div className="absolute w-full h-full flex items-center justify-center bg-gray-100 rounded-2xl text-gray-400">
              Loading cats...
            </div>
          )}
        </div>

        {/* Next Cat Images Preview Row */}
        <div className="flex justify-center gap-2 mb-2 h-10">
          {upcomingCats.map((cat, index) => (
            <motion.div
              key={cat.id}
              className="w-20 h-10 rounded-lg bg-cover bg-center shadow-md border-2 border-gray-200"
              style={{
                backgroundImage: `url(${cat.url})`,
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, type: 'spring', stiffness: 300, damping: 30 }}
            />
          ))}
          {upcomingCats.length === 0 && currentIndex < CAT_COUNT && (
            <p className="text-xs text-gray-400">No upcoming cats to preview</p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-8 mt-2">
          <button
            onClick={() => handleButtonSwipe('left')}
            className="w-14 h-14 rounded-full bg-white shadow flex items-center justify-center text-red-500 text-2xl hover:bg-red-50 active:scale-95 transition"
            aria-label="Dislike"
          >
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24" className='mt-1.5'>
              <path d="M7 14V3H19.5C20.3284 3 21 3.67157 21 4.5V11.5C21 12.3284 20.3284 13 19.5 13H14.72L15.64 18.57C15.74 19.19 15.22 19.75 14.59 19.75C14.22 19.75 13.89 19.53 13.76 19.19L11.29 13H7Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
              <rect x="3" y="3" width="4" height="11" rx="2" stroke="currentColor" strokeWidth="2" />
            </svg>
          </button>
          <button
            onClick={() => handleButtonSwipe('right')}
            className="w-14 h-14 rounded-full bg-white shadow flex items-center justify-center text-green-500 text-2xl hover:bg-green-50 active:scale-95 transition"
            aria-label="Like"
          >
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24" className='mb-1.5'>
              <path d="M7 10V21H19.5C20.3284 21 21 20.3284 21 19.5V12.5C21 11.6716 20.3284 11 19.5 11H14.72L15.64 5.43C15.74 4.81 15.22 4.25 14.59 4.25C14.22 4.25 13.89 4.47 13.76 4.81L11.29 11H7Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
              <rect x="3" y="10" width="4" height="11" rx="2" stroke="currentColor" strokeWidth="2" />
            </svg>
          </button>
        </div>
        {/* Remaining count */}
        {currentIndex < CAT_COUNT && (
          <p className="text-xs text-gray-400 mt-4">{CAT_COUNT - currentIndex} cats remaining</p>
        )}
      </div>
    </div>
  );
};

export default Home;