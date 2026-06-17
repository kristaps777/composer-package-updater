import { type ComposerOutput } from './config.js';
import { type Composer, composerExec } from './composer.js';
import { type Git, gitExec } from './git.js';

export const executor = (): Executor => {
    const composer: Composer = composerExec();
    const git: Git = gitExec();
    const composerAudit = (projectPath: string): ComposerOutput | undefined => {
        return composer.audit(projectPath);
    };

    const composerUpdate = (projectPath: string, packageSet: Set<string>) => {
        return composer.update(projectPath, packageSet);
    };

    const gitCheckoutMain = (projectPath: string): void => {
        return git.checkout(projectPath);
    };

    const gitCreateBranch = (projectPath: string, branchName: string): void => {
        return git.createBranch(projectPath, branchName);
    };

    const gitDeleteBranch = (projectPath: string, branchName: string): void => {
        return git.deleteBranch(projectPath, branchName);
    };

    const gitCommit = (projectPath: string, message: string): boolean => {
        return git.commit(projectPath, message);
    };

    const gitPush = (projectPath: string, branch: string): void => {
        return git.push(projectPath, branch);
    };

    return {
        composerAudit,
        composerUpdate,
        gitCheckoutMain,
        gitCreateBranch,
        gitDeleteBranch,
        gitCommit,
        gitPush,
    };
};

export interface Executor {
    composerAudit: (projectPath: string) => ComposerOutput | undefined;
    composerUpdate: (projectPath: string, packageSet: Set<string>) => void;
    gitCheckoutMain: (projectPath: string) => void;
    gitCreateBranch: (projectPath: string, branchName: string) => void;
    gitDeleteBranch: (projectPath: string, branchName: string) => void;
    gitCommit: (projectPath: string, message: string) => boolean;
    gitPush: (projectPath: string, branch: string) => void;
}
