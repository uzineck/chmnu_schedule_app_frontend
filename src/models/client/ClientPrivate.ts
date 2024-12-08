import {Client} from "./Client.ts";
import {ClientRole} from "../enums/ClientRole.ts";

export interface ClientPrivate {
    uuid: string;
    email: string;
    first_name: string;
    last_name: string;
    created_at: string;
    updated_at: string;
}