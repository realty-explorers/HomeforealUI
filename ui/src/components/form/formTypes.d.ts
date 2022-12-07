
export type InputProps = {
    title: string;
    name: string;
    min?: number;
    max?: number;
    step?: number;
    format?: (value: number) => string;
    abbreviation?: {
        text: string;
        position: 'start' | 'end';
    };
};