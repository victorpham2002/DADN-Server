const jwtConfig = {
    secret: 'DAMH_AIMP_secret_key',
    access: 'DAMH_AIMP_access_key',
    refresh: 'DAMH_AIMP_refresh_key',
    expiresIn: {
        access: '10m',
        refresh: '7d'
    }
}

export default jwtConfig;