declare global {
    namespace NodeJS {
        interface ProcessEnv {
            APPLICATION_TOKEN: string;
            PRIVATE_GUILDS: string;
        }
    }
}

export {}