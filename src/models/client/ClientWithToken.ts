import {ClientPrivate} from "./ClientPrivate.ts";
import {Token} from "./Token.ts";

export interface ClientWithToken extends ClientPrivate, Token{}
