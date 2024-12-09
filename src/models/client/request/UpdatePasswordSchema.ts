export interface UpdatePasswordSchema {
    old_password: string;
    new_password: string;
    verify_password: string;
}