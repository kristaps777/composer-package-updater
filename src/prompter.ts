import readline from 'readline';

export const prompter = (): Prompter => {
    const lineReader = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    const question = (query: any) => new Promise((resolve): void => lineReader.question(query, resolve));
    const prompt = async (userPrompt: string): Promise<string> => {
        const answer = await question(userPrompt);

        return String(answer);
    };

    const close = (): void => {
        lineReader.close();
    };

    return {
        prompt,
        close,
    };
};

export interface Prompter {
    prompt: (question: string) => Promise<string>;
    close: () => void;
}
