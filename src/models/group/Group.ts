import {Subgroup} from "../enums/Subgroup.ts";
import {GroupWithFaculty} from "./GroupWithFaculty.ts";

export interface Group extends GroupWithFaculty{
    has_subgroups: boolean;
    subgroup: Subgroup | null;
}