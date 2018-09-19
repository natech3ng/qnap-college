import { User } from './../auth/_models/user.model';

export interface AuthResponseError {
    message: string;
    success: boolean;
}
export class AuthResponse implements AuthResponseError {
    message: string;
    success: boolean;
    token?: string;
    user?: User;
}
