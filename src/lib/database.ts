// Firestore database utilities
import { db } from './firebase';
import {
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    onSnapshot,
    Timestamp
} from 'firebase/firestore';

// Types
export interface Lesson {
    id: string;
    level: 'beginner' | 'intermediate' | 'advanced';
    day: number;
    title: string;
    titleHi?: string;
    content: string;
    contentHi?: string;
    duration: string;
    isLocked: boolean;
}

export interface Resource {
    id: string;
    title: string;
    type: 'pdf' | 'video' | 'article' | 'tool';
    url: string;
    description: string;
}

export interface Quiz {
    id: string;
    lessonId: string;
    question: string;
    options: string[];
    correctIndex: number;
}

export interface Query {
    id: string;
    userId: string;
    userName: string;
    question: string;
    answer?: string;
    status: 'pending' | 'answered';
    createdAt: Timestamp;
}

// LESSONS
export async function getLessons(level: string): Promise<Lesson[]> {
    const q = query(
        collection(db, 'lessons'),
        where('level', '==', level),
        orderBy('day', 'asc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Lesson));
}

export async function getLesson(level: string, day: number): Promise<Lesson | null> {
    const q = query(
        collection(db, 'lessons'),
        where('level', '==', level),
        where('day', '==', day)
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as Lesson;
}

export async function saveLesson(lesson: Omit<Lesson, 'id'> & { id?: string }): Promise<string> {
    if (lesson.id) {
        await setDoc(doc(db, 'lessons', lesson.id), lesson);
        return lesson.id;
    } else {
        const docRef = await addDoc(collection(db, 'lessons'), lesson);
        return docRef.id;
    }
}

// RESOURCES
export async function getResources(): Promise<Resource[]> {
    const snapshot = await getDocs(collection(db, 'resources'));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Resource));
}

export async function addResource(resource: Omit<Resource, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'resources'), resource);
    return docRef.id;
}

export async function deleteResource(id: string): Promise<void> {
    await deleteDoc(doc(db, 'resources', id));
}

// QUIZZES
export async function getQuizzesByLesson(lessonId: string): Promise<Quiz[]> {
    const q = query(collection(db, 'quizzes'), where('lessonId', '==', lessonId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Quiz));
}

export async function addQuiz(quiz: Omit<Quiz, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'quizzes'), quiz);
    return docRef.id;
}

// QUERIES (Ask Guru)
export async function getQueries(status?: 'pending' | 'answered'): Promise<Query[]> {
    let q;
    if (status) {
        q = query(
            collection(db, 'queries'),
            where('status', '==', status),
            orderBy('createdAt', 'desc')
        );
    } else {
        q = query(collection(db, 'queries'), orderBy('createdAt', 'desc'));
    }
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Query));
}

export async function submitQuery(userId: string, userName: string, question: string): Promise<string> {
    const docRef = await addDoc(collection(db, 'queries'), {
        userId,
        userName,
        question,
        status: 'pending',
        createdAt: Timestamp.now()
    });
    return docRef.id;
}

export async function answerQuery(queryId: string, answer: string): Promise<void> {
    await updateDoc(doc(db, 'queries', queryId), {
        answer,
        status: 'answered'
    });
}

// USER PROGRESS
export async function updateUserProgress(userId: string, currentDay: number): Promise<void> {
    await updateDoc(doc(db, 'users', userId), { currentDay });
}

export async function getUserProgress(userId: string): Promise<number> {
    const docSnap = await getDoc(doc(db, 'users', userId));
    if (docSnap.exists()) {
        return docSnap.data().currentDay || 1;
    }
    return 1;
}

// SEED INITIAL DATA
export async function seedInitialData(): Promise<void> {
    // Check if data already exists
    const lessonsSnapshot = await getDocs(collection(db, 'lessons'));
    if (!lessonsSnapshot.empty) {
        console.log('Data already seeded');
        return;
    }

    // Seed Beginner Lessons
    const beginnerLessons = [
        { level: 'beginner', day: 1, title: 'Introduction to Jyotish', titleHi: 'ज्योतिष का परिचय', content: 'Welcome to the ancient science of Vedic Astrology. Jyotish, meaning "science of light," is one of the six Vedangas (limbs of the Vedas). In this lesson, we explore the foundational philosophy and purpose of Jyotish in understanding karma and destiny.', contentHi: 'वैदिक ज्योतिष के प्राचीन विज्ञान में आपका स्वागत है।', duration: '15 min', isLocked: false },
        { level: 'beginner', day: 2, title: 'The 12 Rashis (Zodiac Signs)', titleHi: '12 राशियाँ', content: 'Learn about the 12 zodiac signs in Vedic astrology: Mesha (Aries), Vrishabha (Taurus), Mithuna (Gemini), Karka (Cancer), Simha (Leo), Kanya (Virgo), Tula (Libra), Vrishchika (Scorpio), Dhanu (Sagittarius), Makara (Capricorn), Kumbha (Aquarius), and Meena (Pisces).', duration: '20 min', isLocked: false },
        { level: 'beginner', day: 3, title: 'The 9 Grahas (Planets)', titleHi: '9 ग्रह', content: 'Discover the nine celestial bodies: Surya (Sun), Chandra (Moon), Mangala (Mars), Budha (Mercury), Guru (Jupiter), Shukra (Venus), Shani (Saturn), Rahu, and Ketu. Each graha has unique qualities and influences.', duration: '25 min', isLocked: false },
        { level: 'beginner', day: 4, title: 'The 12 Bhavas (Houses)', titleHi: '12 भाव', content: 'Understanding the 12 houses of the horoscope. Each bhava represents different life areas: self, wealth, siblings, mother, children, enemies, spouse, longevity, dharma, karma, gains, and moksha.', duration: '25 min', isLocked: false },
        { level: 'beginner', day: 5, title: 'Reading Your First Chart', titleHi: 'पहली कुंडली पढ़ना', content: 'Learn to identify the Lagna (Ascendant) and understand the basic layout of a birth chart. Practice locating planets in houses and signs.', duration: '30 min', isLocked: false },
    ];

    for (const lesson of beginnerLessons) {
        await addDoc(collection(db, 'lessons'), lesson);
    }

    // Seed Resources
    const resources = [
        { title: 'Brihat Parashara Hora Shastra', type: 'pdf', url: 'https://example.com/bphs.pdf', description: 'The foundational text of Vedic Astrology by Sage Parashara' },
        { title: 'Introduction to Jyotish', type: 'video', url: 'https://youtube.com/example', description: 'Beginner-friendly video course on Vedic astrology basics' },
        { title: 'Free Kundli Generator', type: 'tool', url: 'https://kundli.astrosage.com', description: 'Generate accurate Vedic birth charts online' },
    ];

    for (const resource of resources) {
        await addDoc(collection(db, 'resources'), resource);
    }

    console.log('Initial data seeded successfully!');
}
