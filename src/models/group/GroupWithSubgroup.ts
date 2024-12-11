import {Subgroup} from "../enums/Subgroup.ts";
import {Group} from "./Group.ts";

export interface GroupWithSubgroup extends Group{
    subgroup: Subgroup | null;
}