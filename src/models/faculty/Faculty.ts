import {EntityWithUuid} from "../EntityWithUuid.ts";

export interface Faculty extends EntityWithUuid{
    name: string;
    code_name: string;
}

export type FacultyCodeName = Pick<Faculty, 'code_name'>;

