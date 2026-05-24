import {Group} from "./Group.ts";
import {ClientPrivate} from "../client/ClientPrivate.ts";

export interface GroupWithHeadman extends Group{
    headman: ClientPrivate | null;
}