
import React, { useState } from 'react';
import { InputForm } from './components/InputForm';
import { OutputDisplay } from './components/OutputDisplay';
import { Header } from './components/Header';
import { generateMarketingContent } from './services/geminiService';
import type { MarketingInput, MarketingOutput } from './types';
import { SparklesIcon } from './components/icons/SparklesIcon';

const App: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [marketingOutput, setMarketingOutput] = useState<MarketingOutput | null>(null);

    const handleGenerate = async (inputs: MarketingInput) => {
        setIsLoading(true);
        setError(null);
        setMarketingOutput(null);

        try {
            const result = await generateMarketingContent(inputs);
            setMarketingOutput(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

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
                                    حدث خطأ: {error}
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
