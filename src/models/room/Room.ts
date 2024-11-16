import {EntityWithUuid} from "../EntityWithUuid.ts";

export interface Room extends EntityWithUuid{
    number: string;
    description: string | null;
}
