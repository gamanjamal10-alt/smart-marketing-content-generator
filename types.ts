
export enum BrandTone {
    PROFESSIONAL = "احترافي",
    LUXURY = "فاخر",
    FUN = "مرِح",
    YOUTHFUL = "شبابي",
    PRACTICAL = "عملي",
    FAMILY = "عائلي",
}

export interface MarketingInput {
    name: string;
    category: string;
    price: string;
    note?: string;
    brand_tone?: BrandTone | '';
}

export interface MarketingOutput {
    productDescription: string;
    socialPost: string;
    adHeadline: string;
    usp: string[];
    hashtags: string[];
}
