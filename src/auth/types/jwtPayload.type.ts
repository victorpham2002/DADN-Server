type JwtPayload = {
    sub: string;
    username: string;
}

type JwtRefreshTokenPayload = JwtPayload & {
    refreshToken: string
}
export {JwtPayload, JwtRefreshTokenPayload}