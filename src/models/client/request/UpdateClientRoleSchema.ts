import {ClientRole} from "../../enums/ClientRole.ts";

export interface UpdateClientRoleSchema {
    roles: ClientRole[];
}