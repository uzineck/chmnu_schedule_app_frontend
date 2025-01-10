import {OrdinaryNumber} from "./OrdinaryNumber.ts";

export enum LessonTime {
    FIRST = "09:00-10:20",
    SECOND = "10:30-11:50",
    THIRD = "12:30-13:50",
    FOURTH = "14:00-15:20",
    FIFTH = "15:30-16:50",
    SIXTH = "17:00-18:20",
    SEVENTH = "18:30-19:50",
}

export const getLessonTime = (ordinaryNumber: OrdinaryNumber): { startTime: string, endTime: string } => {
    const timeRange = LessonTime[OrdinaryNumber[ordinaryNumber] as keyof typeof LessonTime];
    if (!timeRange) {
        throw new Error('Invalid ordinary number');
    }
    const [startTime, endTime] = timeRange.split("-");
    return { startTime, endTime };
};
