// lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  query, 
  where,
  getDocs,
  addDoc,
  limit, 
  orderBy,
  startAfter,
  DocumentSnapshot
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export type Question = {
  id: string;
  question: string;
  correct: string;
  options: string[];
  difficulty?: string;
  category: string;
  subcategory?: string;
  titbits?: string;
  image_keyword?: string;
  date?: string; // For "today-in-history" questions
  year?: string; // For "today-in-history" questions
};

// Helper function to get client-side date string
function getClientDateString(customDate?: Date): string {
  const date = customDate || new Date();
  // Use client's timezone to format the date
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export async function getCategoryQuestions(category: string, count: number): Promise<Question[]> {
  // First get all questions for the category
  const q = query(
    collection(db, 'triviaQuestions'),
    where('category', '==', category)
  );

  const snapshot = await getDocs(q);
  
  if (snapshot.empty) {
    return [];
  }

  // Categorize questions by difficulty
  const questionsByDifficulty = {
    easy: [] as Question[],
    medium: [] as Question[],
    hard: [] as Question[]
  };

  snapshot.docs.forEach(doc => {
    const data = doc.data();
    const question = {
      id: doc.id,
      category: data.category || 'general',
      question: data.question,
      correct: data.correct_answer,
      options: shuffleArray([...data.incorrect_answers, data.correct_answer]),
      difficulty: data.difficulty?.toLowerCase() || 'medium',
      ...(data.subcategory && { subcategory: data.subcategory }),
      ...(data.titbits && { titbits: data.titbits }),
      ...(data.image_keyword && { image_keyword: data.image_keyword })
    };

    if (question.difficulty === 'easy') {
      questionsByDifficulty.easy.push(question);
    } else if (question.difficulty === 'hard') {
      questionsByDifficulty.hard.push(question);
    } else {
      questionsByDifficulty.medium.push(question);
    }
  });

  // Calculate how many questions to take from each difficulty
  const easyCount = Math.min(
    Math.ceil(count * 0.4), // 40% easy
    questionsByDifficulty.easy.length
  );
  const hardCount = Math.min(
    Math.ceil(count * 0.3), // 30% hard
    questionsByDifficulty.hard.length
  );
  const mediumCount = count - easyCount - hardCount; // Remaining 30%

  // Select random questions from each difficulty
  const getRandomQuestions = (pool: Question[], num: number) => {
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num);
  };

  const selectedQuestions = [
    ...getRandomQuestions(questionsByDifficulty.easy, easyCount),
    ...getRandomQuestions(questionsByDifficulty.medium, mediumCount),
    ...getRandomQuestions(questionsByDifficulty.hard, hardCount)
  ];

  // Shuffle the final selected questions
  return shuffleArray(selectedQuestions);
}

export async function getMoreQuestions(
  category: string, 
  lastVisibleDoc: DocumentSnapshot | null, 
  limitCount: number
): Promise<{ questions: Question[], lastVisible: DocumentSnapshot | null }> {
  let q = query(
    collection(db, 'triviaQuestions'),
    where('category', '==', category),
    orderBy('difficulty'),
    orderBy('randomIndex'),
    limit(limitCount)
  );

  if (lastVisibleDoc) {
    q = query(q, startAfter(lastVisibleDoc));
  }

  const snapshot = await getDocs(q);
  const lastVisible = snapshot.docs[snapshot.docs.length - 1] || null;
  
  return {
    questions: snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        question: data.question,
        correct: data.correct_answer,
        options: shuffleArray([...data.incorrect_answers, data.correct_answer]),
        difficulty: data.difficulty,
        ...(data.subcategory && { subcategory: data.subcategory }),
        ...(data.titbits && { titbits: data.titbits }),
        ...(data.image_keyword && { image_keyword: data.image_keyword })
      };
    }),
    lastVisible
  };
}

export async function getDailyQuizQuestions(category: string, customDate?: Date): Promise<Question[]> {
  // Always use client-side date calculation
  const dateString = getClientDateString(customDate);
  
  console.log('Fetching daily quiz for category:', category, 'date:', dateString); // Debug log
  
  // Query for all questions with today's date
  const q = query(
    collection(db, 'dailyQuizzes'),
    where('date', '==', dateString),
    where('category', '==', category)
  );

  const snapshot = await getDocs(q);
  
  if (snapshot.empty) {
    console.log('No daily quiz found for category:', category, 'date:', dateString); // Debug log
    return [];
  }

  console.log('Found', snapshot.docs.length, 'daily quiz questions for', category); // Debug log

  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      question: data.question,
      correct: data.correct_answer,
      options: shuffleArray([data.correct_answer, ...data.incorrect_answers]),
      difficulty: data.difficulty?.toLowerCase() || 'medium',
      category: data.category,
      ...(data.subcategory && { subcategory: data.subcategory }),
      ...(data.titbits && { titbits: data.titbits }),
      ...(data.image_keyword && { image_keyword: data.image_keyword })
    };
  });
}

export async function getRandomQuestions(
  qlimit: number = 7,
  _difficulties: string[] = ['easy', 'medium', 'hard']
): Promise<Question[]> {
  try {
    // Helper function to get random questions for a specific difficulty
    const getRandomForDifficulty = async (difficulty: string, count: number): Promise<Question[]> => {
      // Generate a random starting index between 0 and 999
      const randomStart = Math.floor(Math.random() * 1000);
      
      // First query: documents where randomIndex >= randomStart
      let q = query(
        collection(db, 'triviaQuestions'),
        where('difficulty', '==', difficulty),
        where('randomIndex', '>=', randomStart),
        orderBy('randomIndex'),
        limit(count)
      );
      
      let snapshot = await getDocs(q);
      let questions: Question[] = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          question: data.question,
          correct: data.correct_answer,
          options: shuffleArray([data.correct_answer, ...data.incorrect_answers]),
          difficulty: difficulty,
          category: data.category,
          ...(data.subcategory && { subcategory: data.subcategory }),
          ...(data.titbits && { titbits: data.titbits }),
          ...(data.image_keyword && { image_keyword: data.image_keyword }),
        };
      });
      
      // If we need more questions, wrap around to the beginning
      const remaining = count - questions.length;
      if (remaining > 0) {
        // Query from the start (randomIndex >= 0) to fill the remaining count
        q = query(
          collection(db, 'triviaQuestions'),
          where('difficulty', '==', difficulty),
          where('randomIndex', '>=', 0),
          orderBy('randomIndex'),
          limit(remaining)
        );
        
        snapshot = await getDocs(q);
        const additional = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            question: data.question,
            correct: data.correct_answer,
            options: shuffleArray([data.correct_answer, ...data.incorrect_answers]),
            difficulty: difficulty,
            category: data.category,
            ...(data.subcategory && { subcategory: data.subcategory }),
            ...(data.titbits && { titbits: data.titbits }),
            ...(data.image_keyword && { image_keyword: data.image_keyword }),
          };
        });
        
        questions = [...questions, ...additional];
      }
      
      // If we still don't have enough questions, log a warning and return what we have
      if (questions.length < count) {
        console.warn(`Only found ${questions.length} questions for difficulty ${difficulty}, needed ${count}`);
      }
      
      // Shuffle the selected questions for this difficulty
      return shuffleArray(questions);
    };

    // Get questions per difficulty (2 easy, 2 medium, 2 hard)
    const easy = await getRandomForDifficulty('easy', 2);
    const medium = await getRandomForDifficulty('medium', 2);
    const hard = await getRandomForDifficulty('hard', 2);

    // Get one bonus question from any difficulty
    const bonusDifficulty = ['easy', 'medium', 'hard'][Math.floor(Math.random() * 3)];
    const bonus = await getRandomForDifficulty(bonusDifficulty, 1);

    // Combine all and shuffle
    const final = [...easy, ...medium, ...hard, ...bonus];
    
    // Ensure we return exactly qlimit questions (default 7)
    const result = shuffleArray(final).slice(0, qlimit);
    
    if (result.length < qlimit) {
      console.warn(`Only returning ${result.length} questions, needed ${qlimit}`);
    }
    
    return result;
  } catch (err) {
    console.error('getRandomQuestions error:', err);
    return [];
  }
}

export async function getTodaysHistoryQuestions(count: number, userDate?: Date): Promise<Question[]> {
  const targetDate = userDate || new Date();
  const monthDay = `${String(targetDate.getMonth() + 1).padStart(2, '0')}-${String(targetDate.getDate()).padStart(2, '0')}`;
  
  console.log('Fetching today in history for date:', monthDay); // Debug log
  
  const q = query(
    collection(db, 'daily_history_trivia'),
    where('date', '==', monthDay),
    limit(count)
  );

  const snapshot = await getDocs(q);
  
  if (snapshot.empty) {
    console.log('No history questions found for date:', monthDay, '- using general history'); // Debug log
    // Fallback to general history questions if no specific ones exist
    return getCategoryQuestions('history', count);
  }

  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      question: data.question,
      correct: data.correct,
      options: shuffleArray([...data.incorrect_answers, data.correct]),
      difficulty: data.difficulty || 'medium',
      category: 'today-in-history',
      subcategory: data.subcategory,
      ...(data.titbits && { titbits: data.titbits }),
      ...(data.image_keyword && { image_keyword: data.image_keyword }),
      date: data.date,
      year: data.year
    };
  });
}

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export type HighScore = {
  id?: string; // Optional since it's added by Firestore
  name: string;
  score: number;
  category: string;
  difficulty?: string;
  timestamp?: Date;
};

export async function getHighScores(
  category: string, 
  limitCount: number = 5
): Promise<HighScore[]> {
  const q = query(
    collection(db, 'scores'),
    where('category', '==', category),
    orderBy('score', 'desc'),
    limit(limitCount)
  );
  console.log("Fetched records for category",category);

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as HighScore[];
}

export async function getGlobalHighScore(
  category: string
): Promise<HighScore | null> {
  const q = query(
    collection(db, 'scores'),
    where('category', '==', category),
    orderBy('score', 'desc'),
    limit(1)
  );

  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  
  return {
    id: snapshot.docs[0].id,
    ...snapshot.docs[0].data()
  } as HighScore;
}

export async function addHighScore(scoreData: Omit<HighScore, 'id'>): Promise<string> {
  const docRef = await addDoc(collection(db, 'scores'), {
    ...scoreData,
    timestamp: new Date()
  });
  return docRef.id;
}

export type Feedback = {
  id?: string;
  rating: number;
  category: string;
  score: number;
  correctCount: number;
  totalQuestions: number;
  timestamp?: Date;
  userId?: string;
  userAgent?: string;
};

export async function addFeedback(feedbackData: Omit<Feedback, 'id'>): Promise<string> {
  const docRef = await addDoc(collection(db, 'feedback'), {
    ...feedbackData,
    timestamp: new Date(),
    userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server'
  });
  return docRef.id;
}