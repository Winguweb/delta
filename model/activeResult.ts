import { GetSamplingPointResponse } from "./samplingPoint";

export interface ActiveResult extends GetSamplingPointResponse {
    distance?: string;
    lastSample?: any,
    owner?: {
        organizationName: string
    }
    samplesResponse?: {
        samples: [],
        currentPage: number,
        totalCount: number,
        totalPages: number
    };
}