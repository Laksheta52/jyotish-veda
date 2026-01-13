import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini - API key will be set from environment
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

export async function translateContent(
    text: string,
    fromLanguage: string,
    toLanguage: string
): Promise<string> {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `Translate the following ${fromLanguage} text to ${toLanguage}. 
This is educational content about Vedic Astrology (Jyotish). 
Maintain the original meaning and any technical Sanskrit terms.
Only return the translated text, nothing else.

Text to translate:
${text}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error('Translation error:', error);
        throw new Error('Failed to translate content');
    }
}

export async function generateQuizQuestion(
    lessonContent: string,
    language: string
): Promise<{
    question: string;
    options: string[];
    correctIndex: number;
}> {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `Based on this Vedic Astrology lesson content, generate a multiple choice quiz question in ${language}.
Return ONLY valid JSON in this exact format (no markdown, no code blocks):
{"question": "your question here", "options": ["option1", "option2", "option3", "option4"], "correctIndex": 0}

Lesson content:
${lessonContent}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text().trim();

        // Parse JSON response
        const parsed = JSON.parse(text);
        return parsed;
    } catch (error) {
        console.error('Quiz generation error:', error);
        throw new Error('Failed to generate quiz question');
    }
}

export async function getGuruResponse(
    question: string,
    context: string = ''
): Promise<string> {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `You are a knowledgeable and compassionate Vedic Astrology teacher (Guru).
A student has asked you a question. Respond in a helpful, educational manner.
Keep your response concise but informative (2-3 paragraphs max).

${context ? `Context from their current lesson: ${context}` : ''}

Student's question: ${question}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error('Guru response error:', error);
        throw new Error('Failed to get response');
    }
}
