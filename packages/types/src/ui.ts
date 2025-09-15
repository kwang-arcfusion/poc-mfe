// packages/types/src/ui.ts
export type DateRange = {
  start: Date | null;
  end: Date | null;
};

export interface OptionItem {
  id: string;
  name: string;
}

export interface OptionGroup {
  name: string;
  children: OptionItem[];
}