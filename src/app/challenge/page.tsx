'use client';

import { useState } from 'react';
import { Trophy, CheckCircle, XCircle, ArrowRight, Sparkles } from 'lucide-react';
import clsx from 'clsx';

const questions = [
    {
        id: 1,
        question: 'Which planet is considered the karaka (significator) of the soul in Vedic astrology?',
        options: ['Moon', 'Sun', 'Jupiter', 'Saturn'],
        correct: 1,
    },
    {
        id: 2,
        question: 'How many Nakshatras are there in Vedic astrology?',
        options: ['12', '27', '9', '36'],
        correct: 1,
    },
    {
        id: 3,
        question: 'Which house represents career and profession in a birth chart?',
        options: ['7th House', '10th House', '1st House', '4th House'],
        correct: 1,
    },
];

export default function ChallengePage() {
    const [currentQ, setCurrentQ] = useState(0);
    const [selected, setSelected] = useState<number | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [score, setScore] = useState(0);
    const [answered, setAnswered] = useState(false);

    const question = questions[currentQ];
    const isCorrect = selected === question.correct;

    const handleSelect = (index: number) => {
        if (answered) return;
        setSelected(index);
        setAnswered(true);
        if (index === question.correct) {
            setScore(score + 1);
        }
    };

    const handleNext = () => {
        if (currentQ < questions.length - 1) {
            setCurrentQ(currentQ + 1);
            setSelected(null);
            setAnswered(false);
        } else {
            setShowResult(true);
        }
    };

    const handleRestart = () => {
        setCurrentQ(0);
        setSelected(null);
        setShowResult(false);
        setScore(0);
        setAnswered(false);
    };

    if (showResult) {
        return (
            <div className="p-6 lg:p-8">
                <div className="max-w-2xl mx-auto">
                    <div className="bg-gradient-to-br from-purple-800 to-purple-600 rounded-2xl p-8 text-center shadow-xl">
                        <Sparkles className="mx-auto text-amber-400 mb-4" size={48} />
                        <h1 className="text-3xl font-bold text-white mb-2">Challenge Complete!</h1>
                        <p className="text-purple-200 mb-6">You've completed today's Cosmic Knowledge Check</p>

                        <div className="bg-white/10 rounded-xl p-6 mb-6">
                            <p className="text-6xl font-bold text-white mb-2">{score}/{questions.length}</p>
                            <p className="text-purple-200">Questions Correct</p>
                        </div>

                        <button
                            onClick={handleRestart}
                            className="px-8 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 lg:p-8">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-800 to-purple-600 rounded-2xl p-6 mb-8 shadow-xl">
                <div className="flex items-center gap-3 mb-2">
                    <Trophy className="text-amber-400" size={28} />
                    <h1 className="text-2xl lg:text-3xl font-bold text-white">Daily Challenge</h1>
                </div>
                <p className="text-purple-200">Cosmic Knowledge Check - Test your understanding</p>
            </div>

            {/* Progress */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Question {currentQ + 1} of {questions.length}</span>
                    <span className="text-sm font-medium text-purple-600">Score: {score}</span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-purple-900/30 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-purple-600 to-amber-500 transition-all duration-300"
                        style={{ width: `${((currentQ + (answered ? 1 : 0)) / questions.length) * 100}%` }}
                    />
                </div>
            </div>

            {/* Question Card */}
            <div className="bg-white dark:bg-[#1a1025] rounded-xl p-6 shadow-lg border border-gray-100 dark:border-purple-900/30 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                    {question.question}
                </h2>

                <div className="space-y-3">
                    {question.options.map((option, index) => (
                        <button
                            key={index}
                            onClick={() => handleSelect(index)}
                            disabled={answered}
                            className={clsx(
                                'w-full text-left px-4 py-4 rounded-lg border-2 transition-all flex items-center justify-between',
                                answered && index === question.correct
                                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                                    : answered && index === selected && !isCorrect
                                        ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                                        : selected === index
                                            ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                                            : 'border-gray-200 dark:border-purple-900/30 hover:border-purple-300 dark:hover:border-purple-700'
                            )}
                        >
                            <span className={clsx(
                                'font-medium',
                                answered && index === question.correct ? 'text-emerald-700 dark:text-emerald-400' :
                                    answered && index === selected && !isCorrect ? 'text-red-700 dark:text-red-400' :
                                        'text-gray-900 dark:text-white'
                            )}>
                                {option}
                            </span>
                            {answered && index === question.correct && <CheckCircle className="text-emerald-500" size={20} />}
                            {answered && index === selected && !isCorrect && <XCircle className="text-red-500" size={20} />}
                        </button>
                    ))}
                </div>
            </div>

            {/* Next Button */}
            {answered && (
                <button
                    onClick={handleNext}
                    className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                    {currentQ < questions.length - 1 ? 'Next Question' : 'See Results'}
                    <ArrowRight size={20} />
                </button>
            )}
        </div>
    );
}
