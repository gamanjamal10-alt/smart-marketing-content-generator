
import { GoogleGenAI, Type } from "@google/genai";
import type { MarketingInput, MarketingOutput } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const model = ai.models;

const schema = {
    type: Type.OBJECT,
    properties: {
        productDescription: {
            type: Type.STRING,
            description: 'الوصف التسويقي الرئيسي: فقرة قصيرة ومؤثرة تصف المنتج.',
        },
        socialPost: {
            type: Type.STRING,
            description: 'منشور لمواقع التواصل الاجتماعي (انستغرام، فيسبوك) مع رموز تعبيرية مناسبة.',
        },
        adHeadline: {
            type: Type.STRING,
            description: 'عنوان إعلاني قصير وجذاب لا يزيد عن 7 كلمات.',
        },
        usp: {
            type: Type.ARRAY,
            description: '3 نقاط بيع فريدة ومختصرة توضح أهم المميزات.',
            items: { type: Type.STRING },
        },
        hashtags: {
            type: Type.ARRAY,
            description: 'قائمة من 5 إلى 10 هاشتاغات ذكية ومرتبطة بالمنتج.',
            items: { type: Type.STRING },
        },
    },
    required: ['productDescription', 'socialPost', 'adHeadline', 'usp', 'hashtags'],
};


const systemInstruction = `
أنت مساعد تسويق ذكي ومتخصص في كتابة المحتوى الإبداعي للمتاجر الإلكترونية باللغة العربية.
مهمتك هي ابتكار محتوى تسويقي احترافي وجذاب لأي منتج، بصوت العلامة التجارية المحددة، وبأسلوب يقنع الزبون بطريقة طبيعية وإنسانية.

**قواعد الأسلوب:**
- استخدم لغة قريبة من الزبون، ودافئة، دون مبالغة أو غموض.
- لا تذكر أسماء منافسين إطلاقًا.
- اجعل الجمل قصيرة ومباشرة، وتجنّب التكرار بألفاظ مختلفة.
- أضف لمسة إنسانية وودّية تناسب نغمة العلامة التجارية.
- في حال غياب الوصف أو نغمة العلامة التجارية، استنتج الأسلوب المناسب بناءً على اسم المنتج والفئة.
- يجب أن يكون كل المحتوى باللغة العربية الفصحى البسيطة والواضحة.
`;


export const generateMarketingContent = async (inputs: MarketingInput): Promise<MarketingOutput> => {
    const prompt = `
الرجاء إنشاء محتوى تسويقي للمنتج التالي بناءً على المعطيات:

- **اسم المنتج:** ${inputs.name}
- **فئة المنتج:** ${inputs.category}
- **السعر التقريبي:** ${inputs.price}
- **ملاحظات من التاجر:** ${inputs.note || 'لا يوجد'}
- **نغمة العلامة التجارية:** ${inputs.brand_tone || 'غير محدد، الرجاء استنتاج النغمة الأنسب'}

قم بتوليد المحتوى المطلوب بصيغة JSON متوافقة مع المخطط (Schema) المحدد.
    `;

    try {
        const response = await model.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json",
                responseSchema: schema,
                temperature: 0.8,
                topP: 0.95,
            }
        });

        const jsonString = response.text.trim();
        const parsedJson = JSON.parse(jsonString);

        // Basic validation
        if (!parsedJson.productDescription || !parsedJson.socialPost || !parsedJson.adHeadline || !Array.isArray(parsedJson.usp) || !Array.isArray(parsedJson.hashtags)) {
             throw new Error("Invalid JSON structure received from API.");
        }

        return parsedJson as MarketingOutput;

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to generate marketing content. Please check the console for more details.");
    }
};
