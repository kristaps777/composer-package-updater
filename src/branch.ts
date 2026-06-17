import 'dotenv/config';
import { config } from './config.js';
import {stringify, type Stringify} from './strings.js';
import {executor, type Executor} from './executor.js';

export const branch = (): Branch => {
    const execute: Executor = executor();

    const name = (userPrompt: string): string => {
        const strings: Stringify = stringify();
        const clean: string = userPrompt.replaceAll(/\D/g, '');
        const ticket: string = strings.sprintf(config.ticketStub, clean);

        return strings.sprintf(config.branchStub, ticket);
    }

    const create = (projectPath: string, branchName: string): void => {
        execute.gitCheckoutMain(projectPath);
        execute.gitCreateBranch(projectPath, branchName);
    }

    return {
        name,
        create,
    }
}

export interface Branch {
    name: (branchName: string) => string;
    create: (projectPath: string, branchName: string) => void;
}