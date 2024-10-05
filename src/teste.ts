import { z } from 'zod';
import { ButtonInteraction } from 'discord.js'; // Simulação do Discord.js

// Definição do tipo ResolverType
enum ResolverType {
    Button = 'BUTTON',
    // Outros tipos podem ser adicionados aqui
}

// Implementação da classe Resolver usando parse como função
class Resolver<T extends z.ZodTypeAny> {
    name: string;
    type: ResolverType;
    parse: (params: unknown) => z.infer<T>;
    executor: (interaction: ButtonInteraction, params: z.infer<T>) => void;

    constructor(options: {
        name: string;
        type: ResolverType;
        parse: (params: unknown) => z.infer<T>; // Função para validar e tipar os parâmetros
        executor: (interaction: ButtonInteraction, params: z.infer<T>) => void; // Função de execução
    }) {
        this.name = options.name;
        this.type = options.type;
        this.parse = options.parse; // Passa o parse como função
        this.executor = options.executor;
    }
}

// Definindo o schema com Zod
const schema = z.object({
    metric: z.string(),
    position: z.number(),
});

// Criando o Resolver e passando parse como função diretamente
const leaderboardResolver = new Resolver({
    name: 'leaderboard',
    type: ResolverType.Button,
    parse: (params) => schema.parse(params), // Usando a função de parse inline
    executor(interaction, params) { // Tipado automaticamente como { metric: string, position: number }
        const { metric, position } = params;
        console.log(`Metric: ${metric}, Position: ${position}`);
        // Lógica de interação vai aqui
    }
});

// Exemplo de uso direto
leaderboardResolver.executor(
    {} as ButtonInteraction, // Simulação de uma interação
    leaderboardResolver.parse({ metric: 'score', position: 1 }) // Passa os parâmetros validados
);
