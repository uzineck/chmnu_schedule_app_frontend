import {FacultyCodeName} from "../faculty/Faculty.ts";
import {EntityWithUuid} from "../EntityWithUuid.ts";

export interface Group extends EntityWithUuid{
    number: string;
    faculty: FacultyCodeName;
    has_subgroups: boolean;
}
