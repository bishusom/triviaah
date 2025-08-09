// components/AnswerToggle.jsx
'use client';

import styles from '@/../styles/Blog.module.css';

export default function AnswerToggle({ showAnswers, toggleAnswers }) {
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
}