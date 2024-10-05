import { AppBootstrap, Command } from "#structs";
import { ApplicationCommandType } from "discord.js";

new Command({
    name: 'ping',
    description: 'Vejá a latência da aplicação',
    type: ApplicationCommandType.ChatInput,
    executor(interaction) {
        interaction.reply(`A minha latência é de ${AppBootstrap.getInstance().ws.ping}ms`)
    }
})