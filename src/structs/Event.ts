import { ClientEvents, Collection } from "discord.js";
import { AppBootstrap } from "./App.js";
import chalk from "chalk";

interface EventOptions<EventType extends keyof ClientEvents> {
    name: string; event: EventType; once?: boolean;
    executor(...args: ClientEvents[EventType]): void;
};

type EventCollection = Collection<string, EventOptions<keyof ClientEvents>>;

export class Event<EventType extends keyof ClientEvents> {
    public static items: Collection<keyof ClientEvents, EventCollection> = new Collection();

    constructor(options: EventOptions<EventType>) {
        const event = Event.items.get(options.event) ?? new Collection();
        event.set(options.name, options);
        Event.items.set(options.event, event);
    };

    public static register(app: AppBootstrap<true>): void {
        for (const [name, events] of Event.items) {
            for (const { once, executor } of events.values()) {
                if (once)  app.once(name, (...args) => executor(...args))
                else app.on(name, (...args) => executor(...args))
            }
        }
    };

    public static print(): void {
        console.log(chalk.bold('\n📂 Loading events...'));
        if (Event.items.size > 0)
            Event.items.forEach(events => events.forEach(({ name }) => 
                console.log(chalk.bold('↪'), chalk.hex('#8A9A5B')(name), 'event')));
        else console.log(chalk.bold('↪'), chalk.gray('there is nothing here'));
        console.log(chalk.bold('Finished!\n'));
    };
}