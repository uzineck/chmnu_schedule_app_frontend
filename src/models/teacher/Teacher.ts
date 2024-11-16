import {EntityWithUuid} from "../EntityWithUuid.ts";
import {TeacherRanks} from "../enums/TeacherRanks.ts";

export interface Teacher extends EntityWithUuid{
    first_name: string;
    last_name: string;
    middle_name: string;
    rank: TeacherRanks;
}