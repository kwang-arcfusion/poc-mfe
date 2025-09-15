// packages/types/src/ui.ts
export type DateRange = {
    start: Date | null;
    end: Date | null;
};

export interface OptionItem {
    id: string;
    name: string;
    channels?: string[]; // ✨ เพิ่ม channels เข้าไปใน type นี้
}

export interface OptionGroup {
    name: string;
    children: OptionItem[];
}