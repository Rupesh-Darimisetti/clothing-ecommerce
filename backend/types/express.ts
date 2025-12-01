
declare global {
    namespace Express {
        interface Request {
            user?: {
                user?: {
                    id: string;
                };
                iat?: number;
                exp?: number;
            };
            isLoggedIn?: boolean;
        }
    }
}

export { };

