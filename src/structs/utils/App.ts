import { GatewayIntentBits, Partials } from "discord.js";

type AppIntentsOptions = 'Messages' | 'Guild' | 'Other' | 'All';
type AppIntents = { [O in AppIntentsOptions]: GatewayIntentBits[] };

const appIntents: AppIntents = {
    /* Intents relacionadas a eventos de mensagens, como mensagens enviadas em guildas ou DMs */
    Messages: [
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent
    ], 
    /* Intents relacionadas a eventos gerais de guilda, como membros, bans, presenças e eventos de voz */
    Guild: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.GuildScheduledEvents
    ],
     /* Intents que não se encaixam em mensagens ou guildas, como reações e digitação em DMs */
    Other: [
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping
    ],
    /* Todas as intents disponíveis, incluindo as de mensagens, guildas e outras */
    All: Object.values(GatewayIntentBits) as GatewayIntentBits[]
} as const;

type AppPartialsOptions = 'All'
type AppPartials = { [O in AppPartialsOptions]: Partials[] };

const appPartials: AppPartials = {
    /* Contém todos os Partials disponíveis no Discord.js, usados para eventos parciais */
    All: Object.values(Partials) as Partials[]
} as const;

export { appIntents, appPartials, type AppIntents, type AppPartials }