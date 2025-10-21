import { type ReactNode } from "react";
export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
}
export interface AuthContextProps {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    token: string | null;
    loading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
}
declare const AuthContext: import("react").Context<AuthContextProps | undefined>;
export declare function AuthProvider({ children }: {
    children: ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export declare const useAuth: () => AuthContextProps;
export default AuthContext;
