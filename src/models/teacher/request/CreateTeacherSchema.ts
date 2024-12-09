import {TeacherRanks} from "../../enums/TeacherRanks.ts";

export interface CreateTeacherSchema {
    first_name: string;
    last_name: string;
    middle_name: string;
    rank: TeacherRanks;
}