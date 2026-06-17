import { directories, type DirectoryScan } from './directory.scan.js';
import { prompter, type Prompter } from './prompter.js';
import { type Branch, branch } from './branch.js';
import { executor, type Executor } from './executor.js';
import {type ComposerOutput, config} from './config.js';
import chalk from 'chalk';

async function main() {
    const scan: DirectoryScan = directories();
    const ask: Prompter = prompter();
    const brancher: Branch = branch();
    const execute: Executor = executor();
    const projects = await scan.all();
    scan.ls(projects);

    // get project index
    const projectIndex: string = await ask.prompt(config.prompts.getProject);
    const selectedIndex = parseInt(String(projectIndex)) - 1;
    if (selectedIndex >= 0 && selectedIndex < projects.length) {
        const selectedProject: string | undefined = projects[selectedIndex];
        if (selectedProject) {
            const ticketId: string = await ask.prompt(config.prompts.getTicket);
            const branchName: string = brancher.name(ticketId);
            const projectCwd: string = await scan.dir(selectedProject);
            const auditResult: ComposerOutput | undefined = execute.composerAudit(projectCwd);
            if (auditResult) {
                const packagesToUpdate: string[] = Object.keys(auditResult.advisories);
                if (packagesToUpdate.length > 0) {
                    brancher.create(projectCwd, branchName);
                    const unique = new Set(packagesToUpdate);
                    const commitMessage: string = 'Updated packages ' + Array.from(unique).join(' ');
                    execute.composerUpdate(projectCwd, unique);
                    execute.gitCommit(projectCwd, commitMessage);
                    execute.gitPush(projectCwd, branchName);
                }
            }
        }
        console.debug(chalk.green('Exiting...'));
        process.exit(0);
    } else {
        console.debug(chalk.red('Invalid selection!'));
        process.exit(1);
    }
}

main().then();
