export interface TuserSignup {
    name: string;
    email: string;
    password: string;
    role: "contributor" | "maintainer"
}

export interface TuserLogin {
    email: string;
    password: string;
}

