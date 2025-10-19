
import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';

export const Header: React.FC = () => {
    return (
        <header className="bg-white dark:bg-slate-800/50 shadow-sm sticky top-0 z-10 backdrop-blur-md">
            <div className="container mx-auto px-4 py-4 flex items-center gap-4">
                 <div className="bg-indigo-100 dark:bg-indigo-900/50 p-3 rounded-lg">
                    <SparklesIcon className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                 </div>
                 <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                        مساعد التسويق الذكي
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        حوّل خصائص منتجك إلى محتوى إبداعي يبيع
                    </p>
                 </div>
            </div>
        </header>
    );
};
