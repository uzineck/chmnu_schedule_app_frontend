import {Subgroup} from "../enums/Subgroup.ts";
import {Group} from "./Group.ts";

export interface GroupForTeacher extends Omit<Group, 'faculty'>{
    subgroups: Subgroup[] | null;
}
