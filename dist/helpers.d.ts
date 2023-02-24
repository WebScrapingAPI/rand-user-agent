interface IntervalArray {
    [key: string]: {
        minIndex: number;
        maxIndex: number;
    };
}
interface FrequencyJson {
    [key: string]: {
        [key: string]: number;
    };
}
interface IntervalJson {
    [key: string]: {
        [key: string]: {
            minIndex: number;
            maxIndex: number;
        };
    };
}
export declare const randomElement: (array: IntervalArray) => string;
export declare const JSONIsFrequency: (json: FrequencyJson) => boolean;
export declare const JSONfrequency: (content: IntervalJson) => FrequencyJson;
export declare const arrayUniqueElements: <T>(array: T[]) => T[];
export declare const JSONfrequencyNormalize: (content: FrequencyJson) => FrequencyJson;
export declare const JSONinterval: (content: FrequencyJson) => IntervalJson;
export {};
//# sourceMappingURL=helpers.d.ts.map