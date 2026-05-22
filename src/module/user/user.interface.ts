export interface Tuser {
    name: string;
    email: string;
    password: string;
    role: "contributor" | "maintainer"
}