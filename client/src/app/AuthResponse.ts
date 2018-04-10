export interface AuthResponse{
    // These six fields are included in all Google ID Tokens.
    iss: string;
    sub: string;
    azp: string;
    aud: string;
    iat: string;
    exp: string;

    // These seven fields are only included when the user has granted the "profile" and
    // "email" OAuth scopes to the application.
    email: string;
    email_verified: boolean;
    name : string;
    picture: string;
    given_name: string;
    family_name: string;
    locale: string;
}
