import {Subgroup} from "../enums/Subgroup.ts";
import {GroupWithFaculty} from "./GroupWithFaculty.ts";

export interface GroupForTeacher extends GroupWithFaculty{
    subgroups: Subgroup[];
}
