import {Client} from "./Client.ts";
import {ClientRole} from "../enums/ClientRole.ts";

export interface ClientPrivate extends Client{
    role: ClientRole;
    email: string;
}