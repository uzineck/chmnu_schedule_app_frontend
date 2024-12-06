import {ClientRole} from "../../enums/ClientRole.ts";

export interface SignUpSchema {
    first_name: string;
    last_name: string;
    middle_name: string;
    role: ClientRole;
    email: string;
    password: string;
    verify_password: string;
}