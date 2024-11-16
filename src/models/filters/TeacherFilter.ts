import {TeacherRanks} from "../enums/TeacherRanks.ts";

export interface TeacherFilter {
    first_name: string | null;
    last_name: string | null;
    middle_name: string | null;
    rank: TeacherRanks | null;
}
