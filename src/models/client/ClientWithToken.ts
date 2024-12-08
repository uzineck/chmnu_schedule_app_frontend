import { Token } from './Token';
import { ClientPrivate } from './ClientPrivate';

export interface ClientWithToken extends ClientPrivate, Token {}
