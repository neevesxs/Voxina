import { Command, Event } from "#structs";

new Event({
    name: 'Interaction create',
    event: 'interactionCreate',
    executor(interaction) {
     switch(true) {
        case interaction.isCommand(): Command.onExecutor(interaction); return;
        case interaction.isAutocomplete(): Command.onAutocomplete(interaction); return;
     };
    }
})