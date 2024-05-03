import 'next-auth';

declare module 'next-auth' {
    interface User {
        _id?: sring,
        username?: string;
        isVerified?: boolean;
        isAcceptingMessage?: boolean;
    };

    interface Session {
        user: {
            _id?: sring,
            username?: string;
            isVerified?: boolean;
            isAcceptingMessage?: boolean;
        } & DefaultSession['user']
    };
}

declare module 'next-auth/jwt' {
    interface JWT {
        _id?: sring,
        username?: string;
        isVerified?: boolean;
        isAcceptingMessage?: boolean;
    }
}