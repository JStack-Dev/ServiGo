export interface AuthResponse {
    token: string;
    user: {
        id: string;
        name: string;
        email: string;
        role: string;
    };
}
export declare function loginUser(email: string, password: string): Promise<AuthResponse>;
export declare function registerUser(name: string, email: string, password: string): Promise<AuthResponse>;
