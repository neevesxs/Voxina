import { ActivityType, Client, ClientOptions, GatewayIntentBits, Partials, version } from "discord.js";
import { appIntents, appPartials, type AppIntents, type AppPartials, Event, Command } from "#structs";

import { pathToFileURL } from "url";
import glob from 'fast-glob';
import path from "path";

import consola from "consola";
import "dotenv/config";
import chalk from "chalk";

type AppBootstrapOptions = Omit<ClientOptions, 'intents' | 'partials'> & {
    workdir: string;
    print?: boolean;
    slashCommand?: {
        servers?: string[];
    };
    directories?: string[];
    intents?: GatewayIntentBits[] | AppIntents;
    partials?: Partials[] | AppPartials;
};

export class AppBootstrap<Ready extends boolean = boolean> extends Client<Ready> {
    private static appInstance: AppBootstrap<true>;
    public static getInstance = (): AppBootstrap<true> => AppBootstrap.appInstance;

    constructor(private data: AppBootstrapOptions) {
        super({
            intents: (data.intents as GatewayIntentBits[] | undefined) ?? appIntents.All,
            partials: (data.partials as Partials[] | undefined) ?? appPartials.All,
            failIfNotExists: data.failIfNotExists ?? false,
            allowedMentions: data.allowedMentions ?? { parse: ['everyone'] },
            presence: data.presence ?? { activities: [ { name: 'Developed by seveenxs', type: ActivityType.Listening } ] }
        });

        this.connect();
        AppBootstrap.appInstance = this as AppBootstrap<true>
    };

    private async connect(): Promise<void> {
        try {
            await super.login(process.env.APPLICATION_TOKEN);
            await this.directoryLoader();

            const servers = AppBootstrap.getInstance().guilds.cache
            .filter(g => this.data.slashCommand?.servers?.includes(g.id));
            
            Command.register(AppBootstrap.getInstance(), servers)
            Event.register(AppBootstrap.getInstance());

            this.print();
        } catch (err) {
            consola.error('An error ocurred:', err);
            return;
        };
    };

    private async directoryLoader() {
        const { workdir, directories = [] } = this.data;

        const basename = path.basename(workdir);
        const patterns = [
            `!./${basename}/structs/*`,
            `./${basename}/discord/**/*.{js,ts}`,
            ...directories.map(p => `./${basename}/${p}/**/*.{js,ts}`)
        ];

        const paths = await glob(patterns, { absolute: true });
        await Promise.all(paths.map(p => import(pathToFileURL(p).href)))
    };

    private print(): void {
        if (!this.data['print']) return;

        Event.print();
        Command.print();

        console.log(`Application connected in ${chalk.bold.hex('#4CA6A6')(AppBootstrap.getInstance().user.username)} in 📦 version ${chalk.bold.hex('#8A9A5B')('v' + version)}\n`+
            `${chalk.bold('↪')} ${chalk.hex('#8CC84B')('node version:')} ${chalk.bold(process.version)}`);
    }
}