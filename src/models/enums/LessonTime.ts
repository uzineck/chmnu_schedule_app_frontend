import {OrdinaryNumber} from "./OrdinaryNumber.ts";

export enum LessonTime {
    FIRST = "08:00-08:45",
    SECOND = "09:00-09:45",
    THIRD = "10:00-10:45",
    FOURTH = "11:00-11:45",
    FIFTH = "12:00-12:45",
    SIXTH = "13:00-13:45",
}

export const getLessonTime = (ordinaryNumber: OrdinaryNumber): { startTime: string, endTime: string } => {
    const timeRange = LessonTime[OrdinaryNumber[ordinaryNumber] as keyof typeof LessonTime];
    if (!timeRange) {
        throw new Error('Invalid ordinary number');
    }
    const [startTime, endTime] = timeRange.split("-");
    return { startTime, endTime };
};
