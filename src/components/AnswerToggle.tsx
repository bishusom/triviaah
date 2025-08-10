'use client';

import { FC } from 'react';
import styles from '@/../styles/Blog.module.css';

// Define the props interface for TypeScript
interface AnswerToggleProps {
  showAnswers: boolean;
  toggleAnswers: () => void;
}

const AnswerToggle: FC<AnswerToggleProps> = ({ showAnswers, toggleAnswers }) => {
  return (
    <button 
      onClick={toggleAnswers}
      className={`${styles.answerToggleBtn} ${showAnswers ? styles.active : ''}`}
    >
      <span className="material-icons">
        {showAnswers ? 'visibility_off' : 'visibility'}
      </span>
      {showAnswers ? 'Hide Answers' : 'Show Answers'}
    </button>
  );
};

export default AnswerToggle;