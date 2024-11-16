import {FacultyCodeName} from "../faculty/Faculty.ts";
import {EntityWithUuid} from "../EntityWithUuid.ts";

export interface GroupWithFaculty extends EntityWithUuid{
    number: string;
    faculty: FacultyCodeName;
}
