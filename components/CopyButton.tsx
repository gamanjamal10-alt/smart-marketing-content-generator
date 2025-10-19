
import React, { useState } from 'react';
import { CopyIcon } from './icons/CopyIcon';
import { CheckIcon } from './icons/CheckIcon';

interface CopyButtonProps {
    textToCopy: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({ textToCopy }) => {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(textToCopy);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
            alert('Failed to copy text.');
        }
    };

    return (
        <button
            onClick={handleCopy}
            className={`p-2 rounded-full transition-colors duration-200 ${
                isCopied 
                ? 'bg-green-100 dark:bg-green-800/50 text-green-600 dark:text-green-300' 
                : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
            }`}
            aria-label={isCopied ? 'تم النسخ' : 'نسخ النص'}
        >
            {isCopied ? (
                <CheckIcon className="w-5 h-5" />
            ) : (
                <CopyIcon className="w-5 h-5" />
            )}
        </button>
    );
};
