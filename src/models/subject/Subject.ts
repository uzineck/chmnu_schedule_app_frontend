import {EntityWithUuid} from "../EntityWithUuid.ts";

export interface Subject extends EntityWithUuid{
    title: string;
    slug: string;
}