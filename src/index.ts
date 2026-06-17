import { directories, type DirectoryScan } from './directory.scan.js';
import { prompter, type Prompter } from './prompter.js';
import { type Branch, branch } from './branch.js';
import { executor, type Executor } from './executor.js';
import {type ComposerOutput, config} from './config.js';
import chalk from 'chalk';

async function main() {
    // init composables
    const scan: DirectoryScan = directories();
    const ask: Prompter = prompter();
    const brancher: Branch = branch();
    const execute: Executor = executor();
    // scan projects root & list
    const projects = await scan.all();
    scan.ls(projects);

    // get project index
    const projectIndex: string = await ask.prompt(config.prompts.getProject);
    const selectedIndex = parseInt(String(projectIndex)) - 1;
    // check, if valid project selected
    if (selectedIndex >= 0 && selectedIndex < projects.length) {
        const selectedProject: string | undefined = projects[selectedIndex];
        if (selectedProject) {
            // prompt for ticket number (needed for branch name)
            const ticketId: string = await ask.prompt(config.prompts.getTicket);
            // set branch name, get cwd & perform audit
            const branchName: string = brancher.name(ticketId);
            const projectCwd: string = await scan.dir(selectedProject);
            const auditResult: ComposerOutput | undefined = execute.composerAudit(projectCwd);
            if (auditResult) {
                // parse audit result
                const packagesToUpdate: string[] = Object.keys(auditResult.advisories);
                if (packagesToUpdate.length > 0) {
                    // if we have packages from audit, attempt to continue
                    // first, create a new branch
                    brancher.create(projectCwd, branchName);
                    // get unique packages, there can be multiple CVE's for the same package
                    const unique = new Set(packagesToUpdate);
                    const commitMessage: string = 'Updated packages ' + Array.from(unique).join(' ');
                    // execute commands in order - composer update, git commit, git push
                    execute.composerUpdate(projectCwd, unique);
                    const commited: boolean = execute.gitCommit(projectCwd, commitMessage);
                    if (commited) {
                        execute.gitPush(projectCwd, branchName);
                    } else {
                        execute.gitDeleteBranch(projectCwd, branchName);
                    }
                }
            }
        }
        // end process
        console.debug(chalk.green('Exiting...'));
        process.exit(0);
    } else {
        // invalid project index was selected, exiting
        console.debug(chalk.red('Invalid selection!'));
        process.exit(1);
    }
}

main().then();
