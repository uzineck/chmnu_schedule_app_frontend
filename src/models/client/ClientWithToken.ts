import { Token } from './Token';
import { ClientPrivate } from './ClientPrivate';

export interface ClientWithToken {
    client: ClientPrivate;
    token: Token;
}
