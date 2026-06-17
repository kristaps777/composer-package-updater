import 'dotenv/config';
import { type ComposerOutput, config } from './config.js';
import { execSync } from 'child_process';
import chalk from 'chalk';

export const composerExec = (): Composer => {
    const audit = (projectPath: string): ComposerOutput | undefined => {
        try {
            execSync(config.composer.audit, {
                cwd: projectPath,
                encoding: 'utf8',
                stdio: 'pipe',
                maxBuffer: 1024 * 1024 * 20,
            });
            console.log('No vulnerabilities found');
            return;
        } catch (error: any) {
            if (error.status === 1 && error.stdout) {
                try {
                    return JSON.parse(error.stdout) as ComposerOutput;
                } catch {
                    console.log(error.stdout);
                    return;
                }
            }

            console.error('Composer audit failed:', error.message);
            throw error;
        }
    };

    const update = (projectPath: string, packageSet: Set<string>) => {
        try {
            const packages: string = Array.from(packageSet).join(' ');
            const command = `${config.composer.update} ${packages}`;
            execSync(command, {
                cwd: projectPath,
                stdio: 'inherit',
            });
        } catch (error: any) {
            console.error(chalk.red(error.message));
        }
    };

    return {
        audit,
        update,
    };
};

export interface Composer {
    audit: (projectPath: string) => ComposerOutput | undefined;
    update: (projectPath: string, packageSet: Set<string>) => void;
}
