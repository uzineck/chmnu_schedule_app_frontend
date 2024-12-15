import {GroupAll} from "./GroupAll.ts";

export interface Group extends GroupAll{
    has_subgroups: boolean;
}