import {TeacherRanks} from "../enums/TeacherRanks.ts";

export interface TeacherFilter {
    /** Backend matches against last_name + first_name + middle_name. */
    name?: string | null;
    rank?: TeacherRanks | null;
}
