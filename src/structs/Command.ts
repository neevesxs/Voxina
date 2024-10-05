import { ApplicationCommandType, AutocompleteInteraction, ChatInputApplicationCommandData, ChatInputCommandInteraction, Collection, CommandInteraction, Guild, MessageApplicationCommandData, MessageContextMenuCommandInteraction, UserApplicationCommandData, UserContextMenuCommandInteraction } from "discord.js";
import { AppBootstrap } from "./App.js";
import chalk from "chalk";

type CommandName<Name extends string> =
    Name extends "" ? never :
    Name extends `${string} ${string}` ? never :
    Name extends Lowercase<Name> ? Name : never;

type CommandGetType<Name extends string, Type> =
    Type extends ApplicationCommandType.ChatInput ? ChatInputApplicationCommandData & {
        name: CommandName<Name>; global?: boolean;
        executor(interaction: ChatInputCommandInteraction): void;
        autocomplete?(interaction: AutocompleteInteraction): void
    } :
    Type extends ApplicationCommandType.Message ? MessageApplicationCommandData & {
        name: Name extends "" ? never : Name; global?: boolean;
        executor(interaction: MessageContextMenuCommandInteraction): void
    } :
    Type extends ApplicationCommandType.User ? UserApplicationCommandData & {
        name: Name extends "" ? never : Name; global?: boolean;
        executor(interaction: UserContextMenuCommandInteraction): void
    } : never;
//

export class Command<
    Name extends string,
    Type extends ApplicationCommandType = ApplicationCommandType.ChatInput
> {
    public static items: Collection<string, CommandGetType<any, any>> = new Collection();

    constructor(options: CommandGetType<Name, Type>) {
        options.type??=ApplicationCommandType.ChatInput;
        Command.items.set(options.name, options);
    };

    public static async register(app: AppBootstrap<true>, guilds?: Collection<string, Guild>): Promise<void> {
        if (guilds?.size) {
            const [globalCommands, guildCommands] = Command.items.partition(c => c.global);

            await app.application.commands.set(Array.from(globalCommands.values()));
            for (const guild of guilds.values()) await guild.commands.set(Array.from(guildCommands.values()));
        };

        for (const guild of app.guilds.cache.values()) await guild.commands.set([]);
        await app.application.commands.set(Array.from(Command.items.values()));
    };

    public static onExecutor(interaction: CommandInteraction) {
        const command = Command.items.get(interaction.commandName);
        if (command && 'executor' in command) command.executor(interaction as never);
    };

    public static onAutocomplete(interaction: AutocompleteInteraction) {
        const command = Command.items.get(interaction.commandName);
        if (command && 'autocomplete' in command) command.autocomplete!(interaction);
    }

    public static print(): void {
        console.log(chalk.bold('\n📁 Loading commands...'));
        if (Command.items.size > 0)
            Command.items.forEach(({ name, global }) => console.log(chalk.bold('↪'), chalk.hex('#8A9A5B')(name), `${global ? 'global' : 'guild'} command`));
        else console.log(chalk.bold('↪'), chalk.gray('there is nothing here'));
        console.log(chalk.bold('Finished!\n'));
    };
}