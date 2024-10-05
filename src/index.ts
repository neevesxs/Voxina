import { AppBootstrap } from "#structs";

new AppBootstrap({
    workdir: import.meta.dirname, print: true,
    slashCommand: {
        servers: process.env.PRIVATE_GUILDS.split(" ")
    }
});