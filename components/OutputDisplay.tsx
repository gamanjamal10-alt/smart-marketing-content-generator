
import React from 'react';
import type { MarketingOutput } from '../types';
import { CopyButton } from './CopyButton';

interface OutputDisplayProps {
    output: MarketingOutput;
}

const OutputCard: React.FC<{ title: string; children: React.ReactNode; textToCopy: string }> = ({ title, children, textToCopy }) => (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-5 relative transition-all hover:shadow-lg">
        <div className="absolute top-3 left-3">
             <CopyButton textToCopy={textToCopy} />
        </div>
        <h3 className="text-lg font-bold mb-3 text-indigo-600 dark:text-indigo-400">{title}</h3>
        <div className="text-slate-600 dark:text-slate-300 space-y-2 prose prose-sm dark:prose-invert max-w-none">
            {children}
        </div>
    </div>
);


export const OutputDisplay: React.FC<OutputDisplayProps> = ({ output }) => {
    return (
        <div className="space-y-6 animate-fade-in">
             <OutputCard title="الوصف التسويقي الرئيسي" textToCopy={output.productDescription}>
                <p>{output.productDescription}</p>
            </OutputCard>

            <OutputCard title="منشور لمواقع التواصل" textToCopy={output.socialPost}>
                 <p style={{ whiteSpace: 'pre-wrap' }}>{output.socialPost}</p>
            </OutputCard>
            
            <OutputCard title="عنوان إعلاني قصير" textToCopy={output.adHeadline}>
                <p className="text-xl font-semibold">{output.adHeadline}</p>
            </OutputCard>

            <OutputCard title="نقاط البيع الفريدة (USP)" textToCopy={output.usp.join('\n')}>
                <ul className="list-disc list-inside">
                    {output.usp.map((point, index) => <li key={index}>{point}</li>)}
                </ul>
            </OutputCard>

            <OutputCard title="هاشتاغات مقترحة" textToCopy={output.hashtags.join(' ')}>
                <div className="flex flex-wrap gap-2">
                    {output.hashtags.map((tag, index) => (
                        <span key={index} className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-sm font-medium px-3 py-1 rounded-full">
                            {tag}
                        </span>
                    ))}
                </div>
            </OutputCard>
        </div>
    );
};
