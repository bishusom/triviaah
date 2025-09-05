'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';

export function useQuizStart() {
  const [showStartModal, setShowStartModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const { data: session } = useSession();

  const startQuiz = (category: string) => {
    setSelectedCategory(category);
    
    if (session) {
      window.location.href = `/quiz?category=${category}`;
    } else {
      setShowStartModal(true);
    }
  };

  const handleGuestStart = () => {
    setShowStartModal(false);
    window.location.href = `/quiz?category=${selectedCategory}&mode=guest`;
  };

  const handleCloseModal = () => {
    setShowStartModal(false);
  };

  return {
    showStartModal,
    startQuiz,
    handleGuestStart,
    handleCloseModal,
    selectedCategory
  };
}