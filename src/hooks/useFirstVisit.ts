import { useState, useEffect } from 'react';

const STORAGE_KEY = 'concrete-crack-detector-first-visit';

export function useFirstVisit() {
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);

  useEffect(() => {
    // Check if this is the user's first visit
    const hasVisitedBefore = localStorage.getItem(STORAGE_KEY);
    
    if (!hasVisitedBefore) {
      setIsFirstVisit(true);
      setShowWelcomePopup(true);
    }
  }, []);

  const markAsVisited = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setIsFirstVisit(false);
    setShowWelcomePopup(false);
  };

  const hidePopup = () => {
    setShowWelcomePopup(false);
  };

  const showPopup = () => {
    setShowWelcomePopup(true);
  };

  return {
    isFirstVisit,
    showWelcomePopup,
    markAsVisited,
    hidePopup,
    showPopup,
  };
} 