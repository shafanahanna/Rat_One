export declare enum UserRole {
    DIRECTOR = "Director",
    HR = "HR",
    DM = "DM",
    TC = "TC",
    BA = "BA",
    RT = "RT",
    AC = "AC"
}
export declare class RegisterDto {
    username: string;
    email: string;
    password_hash: string;
    role: UserRole;
}
