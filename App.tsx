import React, { useState, useEffect } from 'react';
import { InputForm } from './components/InputForm';
import { OutputDisplay } from './components/OutputDisplay';
import { Header } from './components/Header';
import { generateMarketingContent } from './services/geminiService';
import type { MarketingInput, MarketingOutput } from './types';
import { SparklesIcon } from './components/icons/SparklesIcon';
import { KeyIcon } from './components/icons/KeyIcon';

// Add type declarations for the aistudio object to satisfy TypeScript
// FIX: Defined AIStudio interface to avoid type conflicts with other global declarations.
interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
}

declare global {
    interface Window {
        aistudio?: AIStudio;
    }
}

const App: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [marketingOutput, setMarketingOutput] = useState<MarketingOutput | null>(null);
    const [isKeyReady, setIsKeyReady] = useState<boolean>(false);

    useEffect(() => {
        const checkApiKey = async () => {
            if (window.aistudio && await window.aistudio.hasSelectedApiKey()) {
                setIsKeyReady(true);
            }
        };
        checkApiKey();
    }, []);

    const handleSelectKey = async () => {
        setError(null);
        if (window.aistudio) {
            try {
                await window.aistudio.openSelectKey();
                // Assume success to improve UX and avoid race conditions.
                // The next API call will validate if the key is actually usable.
                setIsKeyReady(true);
            } catch (e) {
                console.error("Failed to open API key selection:", e);
                setError("لم نتمكن من فتح نافذة اختيار مفتاح الواجهة البرمجية.");
            }
        }
    };

    const handleGenerate = async (inputs: MarketingInput) => {
        setIsLoading(true);
        setError(null);
        setMarketingOutput(null);

        try {
            const result = await generateMarketingContent(inputs);
            setMarketingOutput(result);
        } catch (err) {
            console.error("Generation failed:", err);
            
            let userFriendlyError = "حدث خطأ غير متوقع. الرجاء المحاولة مرة أخرى لاحقاً.";

            if (err instanceof Error) {
                const errorMessage = err.message.toLowerCase();
                 if (errorMessage.includes('requested entity was not found')) {
                     userFriendlyError = "فشلت المصادقة. قد يكون مفتاح الواجهة البرمجية المحدد غير صالح. يرجى تحديد مفتاح آخر.";
                     setIsKeyReady(false); // Reset key state to show the prompt again
                } else if (errorMessage.includes('api key') || errorMessage.includes('permission denied') || errorMessage.includes('authentication')) {
                    userFriendlyError = "حدث خطأ في الاتصال. يرجى التأكد من صلاحية مفتاح الواجهة البرمجية (API Key) وأنه مُعد بشكل صحيح.";
                } else if (errorMessage.includes('invalid json')) {
                    userFriendlyError = "فشل في معالجة الرد من النموذج. قد يكون المحتوى المطلوب معقداً جداً. حاول تبسيط طلبك والمحاولة مرة أخرى.";
                } else if (errorMessage.includes('deadline exceeded') || errorMessage.includes('timeout')) {
                    userFriendlyError = "استغرقت العملية وقتاً طويلاً جداً. يرجى المحاولة مرة أخرى.";
                }
            }
            
            setError(userFriendlyError);
        } finally {
            setIsLoading(false);
        }
    };
    
    if (!isKeyReady) {
        return (
             <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 flex flex-col items-center justify-center p-4">
                <div className="text-center bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg max-w-lg w-full">
                    <div className="mx-auto bg-amber-100 dark:bg-amber-900/50 p-4 rounded-full w-fit">
                        <KeyIcon className="w-10 h-10 text-amber-600 dark:text-amber-400" />
                    </div>
                    <h1 className="text-2xl font-bold mt-4 text-slate-800 dark:text-slate-100">
                        مطلوب مفتاح الواجهة البرمجية
                    </h1>
                    <p className="mt-2 text-slate-500 dark:text-slate-400">
                        للبدء في توليد المحتوى، يرجى تحديد مفتاح واجهة برمجية صالح. سيتم استخدام هذا المفتاح لمصادقة طلباتك.
                    </p>
                    {error && (
                         <p className="mt-4 text-red-600 dark:text-red-300 text-center bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 rounded-lg py-2 px-4">
                            {error}
                        </p>
                    )}
                    <button 
                        onClick={handleSelectKey}
                        className="mt-6 w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 transition-colors duration-300"
                    >
                        تحديد مفتاح الواجهة البرمجية
                    </button>
                    <p className="mt-4 text-xs text-slate-400 dark:text-slate-500">
                        قد يتم تطبيق رسوم على استخدام واجهة Gemini البرمجية. 
                        <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="underline hover:text-indigo-500">
                             اعرف المزيد عن الفوترة
                        </a>.
                    </p>
                </div>
            </div>
        );
    }


    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
            <Header />
            <main className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-4">
                        <InputForm onGenerate={handleGenerate} isLoading={isLoading} />
                    </div>
                    <div className="lg:col-span-8">
                        {isLoading && (
                            <div className="flex flex-col items-center justify-center h-full bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8">
                                <SparklesIcon className="w-16 h-16 text-indigo-500 animate-pulse" />
                                <p className="mt-4 text-lg font-semibold text-slate-600 dark:text-slate-300">
                                    جاري ابتكار المحتوى...
                                </p>
                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                    لحظات قليلة وننتهي من سحر الكلمات.
                                </p>
                            </div>
                        )}
                        {error && (
                            <div className="flex items-center justify-center h-full bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 rounded-xl p-8">
                                <p className="text-red-600 dark:text-red-300 text-center">
                                    {error}
                                </p>
                            </div>
                        )}
                        {!isLoading && !error && marketingOutput && (
                            <OutputDisplay output={marketingOutput} />
                        )}
                        {!isLoading && !error && !marketingOutput && (
                             <div className="flex flex-col items-center justify-center h-full bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 border-2 border-dashed border-slate-200 dark:border-slate-700">
                                <SparklesIcon className="w-16 h-16 text-slate-400 dark:text-slate-500" />
                                <h3 className="mt-4 text-lg font-bold text-slate-700 dark:text-slate-200">محتواك الإبداعي سيظهر هنا</h3>
                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 text-center max-w-sm">
                                    املأ الحقول في النموذج على اليمين، واضغط على زر "توليد المحتوى" لترى السحر يحدث.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default App;
