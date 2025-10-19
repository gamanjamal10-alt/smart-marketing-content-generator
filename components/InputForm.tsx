
import React, { useState } from 'react';
import type { MarketingInput } from '../types';
import { BrandTone } from '../types';
import { BRAND_TONES } from '../constants';
import { SparklesIcon } from './icons/SparklesIcon';

interface InputFormProps {
    onGenerate: (inputs: MarketingInput) => void;
    isLoading: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({ onGenerate, isLoading }) => {
    const [formData, setFormData] = useState<MarketingInput>({
        name: '',
        category: '',
        price: '',
        note: '',
        brand_tone: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.name && formData.category && formData.price) {
            onGenerate(formData);
        } else {
            alert("الرجاء ملء الحقول الإلزامية: اسم المنتج، الفئة، والسعر.");
        }
    };

    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg h-full">
            <h2 className="text-xl font-bold mb-1 text-slate-800 dark:text-slate-100">أخبرنا عن منتجك</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">كلما كانت التفاصيل أدق، كان المحتوى أفضل.</p>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">اسم المنتج <span className="text-red-500">*</span></label>
                    <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500" placeholder="مثال: سماعة لاسلكية عازلة للضوضاء" />
                </div>
                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">فئة المنتج <span className="text-red-500">*</span></label>
                    <input type="text" id="category" name="category" value={formData.category} onChange={handleChange} required className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500" placeholder="مثال: إلكترونيات" />
                </div>
                <div>
                    <label htmlFor="price" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">السعر التقريبي <span className="text-red-500">*</span></label>
                    <input type="text" id="price" name="price" value={formData.price} onChange={handleChange} required className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500" placeholder="مثال: 450 ريال سعودي" />
                </div>
                <div>
                    <label htmlFor="note" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">وصف بسيط أو ملاحظة (اختياري)</label>
                    <textarea id="note" name="note" value={formData.note} onChange={handleChange} rows={3} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500" placeholder="مثال: بطارية تدوم 20 ساعة، متوفرة بثلاثة ألوان"></textarea>
                </div>
                <div>
                    <label htmlFor="brand_tone" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">نغمة العلامة التجارية (اختياري)</label>
                    <select id="brand_tone" name="brand_tone" value={formData.brand_tone} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500">
                        <option value="">-- اختر نغمة --</option>
                        {BRAND_TONES.map(tone => <option key={tone} value={tone}>{tone}</option>)}
                    </select>
                </div>
                <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-bold py-3 px-4 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 dark:disabled:bg-indigo-800 disabled:cursor-not-allowed transition-colors duration-300">
                    {isLoading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            جاري التوليد...
                        </>
                    ) : (
                        <>
                           <SparklesIcon className="w-5 h-5" />
                            <span>توليد المحتوى</span>
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};
