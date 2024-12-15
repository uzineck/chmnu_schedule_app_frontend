import {Subgroup} from "../enums/Subgroup.ts";
import {GroupAll} from "./GroupAll.ts";

export interface GroupForTeacher extends Omit<GroupAll, 'faculty'>{
    subgroups: Subgroup[] | null;
}
