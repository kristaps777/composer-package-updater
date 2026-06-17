import 'dotenv/config';
import { config } from './config.js';
import { execSync } from 'child_process';
import { stringify, type Stringify } from './strings.js';
import chalk from 'chalk';

export const gitExec = (): Git => {
    const strings: Stringify = stringify();
    const checkout = (projectPath: string, branch: string = 'main'): void => {
        const command = `${config.git.checkout} ${branch} --force`;
        execSync(command, {
            cwd: projectPath,
        });
    };

    const createBranch = (projectPath: string, branchName: string, baseBranch: string = 'main'): void => {
        const showRefCommand: string = strings.sprintf(config.git.showRef, branchName);
        const resetCommand: string = strings.sprintf(config.git.reset, baseBranch);
        const createCommand: string = strings.sprintf(config.git.createBranch, branchName);
        execSync(config.git.fetchOrigin, {
            cwd: projectPath,
            stdio: 'inherit',
        });
        let branchExists: boolean = true;
        try {
            execSync(showRefCommand, {
                cwd: projectPath,
                stdio: 'ignore',
            });
        } catch {
            branchExists = false;
        }
        if (branchExists) {
            checkout(projectPath, branchName);
            return;
        }
        checkout(projectPath, baseBranch);
        execSync(resetCommand, {
            cwd: projectPath,
            stdio: 'inherit',
        });
        execSync(createCommand, {
            cwd: projectPath,
            stdio: 'inherit',
        });
    };

    const diff = (projectPath: string): string => {
        try {
            return execSync(config.git.diff, {
                cwd: projectPath,
                encoding: 'utf8',
            });
        } catch {
            return '';
        }
    };

    const commit = (projectPath: string, message: string): void => {
        const commitCommand: string = strings.sprintf(config.git.commit, message);
        if (!hasChanges(projectPath)) {
            console.log(chalk.yellow('No changes to commit'));
            return;
        }

        execSync(commitCommand, {
            cwd: projectPath,
            stdio: 'inherit',
        });
    };

    const hasChanges = (projectPath: string): boolean => {
        try {
            const output = execSync(config.git.status, {
                cwd: projectPath,
                encoding: 'utf8',
            });
            return output.trim().length > 0;
        } catch {
            return false;
        }
    };

    const push = (projectPath: string, branch: string): void => {
        const pushCommand: string = strings.sprintf(config.git.push, branch);
        if (!hasChanges(projectPath)) {
            console.log(chalk.yellow('No changes to push'));
            return;
        }

        execSync(pushCommand, {
            cwd: projectPath,
            stdio: 'inherit'
        });
    };

    return {
        checkout,
        createBranch,
        diff,
        commit,
        push,
    };
};

export interface Git {
    checkout: (projectPath: string, branch?: string) => void;
    createBranch: (projectPath: string, branchName: string, baseBranch?: string) => void;
    diff: (projectPath: string) => string;
    commit: (projectPath: string, message: string) => void;
    push: (projectPath: string, branch: string) => void;
}
