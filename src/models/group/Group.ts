import {FacultyCodeName} from "../faculty/Faculty.ts";
import {EntityWithUuid} from "../EntityWithUuid.ts";

export interface Group extends EntityWithUuid{
    number: string;
    faculty: FacultyCodeName;
    has_subgroups: boolean;
    /** ISO datetime; null when the schedule has never been touched. */
    schedule_updated_at?: string | null;
}
