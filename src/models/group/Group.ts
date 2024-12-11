import {GroupWithFaculty} from "./GroupWithFaculty.ts";

export interface Group extends GroupWithFaculty{
    has_subgroups: boolean;
}