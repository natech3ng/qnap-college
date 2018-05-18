import { User } from './../auth/_models/user.model';

export class AuthResponse {
    message: string;
    success: boolean;
    token?: string;
    user?: User;
}
