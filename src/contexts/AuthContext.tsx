'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
    User,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    signOut,
    updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '@/lib/firebase';

interface UserData {
    uid: string;
    email: string | null;
    displayName: string | null;
    role: 'student' | 'admin';
    subscription: 'free' | 'intermediate' | 'advanced';
    currentDay: number;
    createdAt: Date;
}

interface AuthContextType {
    user: User | null;
    userData: UserData | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string, name: string) => Promise<void>;
    signInWithGoogle: () => Promise<void>;
    signInAsAdmin: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setUser(user);

            if (user) {
                // Fetch user data from Firestore
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (userDoc.exists()) {
                    setUserData(userDoc.data() as UserData);
                    // Store in localStorage for sidebar
                    localStorage.setItem('userType', userDoc.data().role);
                    localStorage.setItem('userName', user.displayName || user.email?.split('@')[0] || 'User');
                }
            } else {
                setUserData(null);
                localStorage.removeItem('userType');
                localStorage.removeItem('userName');
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const createUserDocument = async (user: User, role: 'student' | 'admin' = 'student') => {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            const newUserData: UserData = {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                role: role,
                subscription: 'free',
                currentDay: 1,
                createdAt: new Date(),
            };
            await setDoc(userRef, newUserData);
            setUserData(newUserData);
        } else {
            setUserData(userSnap.data() as UserData);
        }
    };

    const signIn = async (email: string, password: string) => {
        const result = await signInWithEmailAndPassword(auth, email, password);
        await createUserDocument(result.user, 'student');
        localStorage.setItem('userType', 'student');
        localStorage.setItem('userName', result.user.displayName || email.split('@')[0]);
    };

    const signUp = async (email: string, password: string, name: string) => {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(result.user, { displayName: name });
        await createUserDocument(result.user, 'student');
        localStorage.setItem('userType', 'student');
        localStorage.setItem('userName', name);
    };

    const signInWithGoogle = async () => {
        const result = await signInWithPopup(auth, googleProvider);
        await createUserDocument(result.user, 'student');
        localStorage.setItem('userType', 'student');
        localStorage.setItem('userName', result.user.displayName || 'User');
    };

    const signInAsAdmin = async (email: string, password: string) => {
        const result = await signInWithEmailAndPassword(auth, email, password);
        // Check if user is admin in Firestore
        const userDoc = await getDoc(doc(db, 'users', result.user.uid));
        if (userDoc.exists() && userDoc.data().role === 'admin') {
            setUserData(userDoc.data() as UserData);
            localStorage.setItem('userType', 'admin');
            localStorage.setItem('userName', result.user.displayName || 'Admin');
        } else {
            // Create/update as admin
            await setDoc(doc(db, 'users', result.user.uid), {
                uid: result.user.uid,
                email: result.user.email,
                displayName: result.user.displayName,
                role: 'admin',
                subscription: 'advanced',
                currentDay: 30,
                createdAt: new Date(),
            }, { merge: true });
            localStorage.setItem('userType', 'admin');
            localStorage.setItem('userName', result.user.displayName || 'Admin');
        }
    };

    const logout = async () => {
        await signOut(auth);
        localStorage.removeItem('userType');
        localStorage.removeItem('userName');
        setUserData(null);
    };

    return (
        <AuthContext.Provider value={{
            user,
            userData,
            loading,
            signIn,
            signUp,
            signInWithGoogle,
            signInAsAdmin,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
