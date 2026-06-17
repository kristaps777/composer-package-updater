import 'dotenv/config';
import fsExtra from 'fs-extra';
import { config } from './config.js';
import path from 'path';
import { chdir, cwd } from 'node:process';

export const directories = (): DirectoryScan => {
    const ProjectsRoot: string = config.projectsRoot;

    const getProjectPaths = (projectDirectory: string): { dir: string; composerPath: string }[] => {
        return [
            {
                dir: path.join(ProjectsRoot, projectDirectory),
                composerPath: path.join(ProjectsRoot, projectDirectory, config.composerJson)
            },
            {
                dir: path.join(ProjectsRoot, projectDirectory, config.webRoot),
                composerPath: path.join(ProjectsRoot, projectDirectory, config.webRoot, config.composerJson)
            }
        ];
    }

    const hasComposerJson = async (projectDirectory: string): Promise<boolean> => {
        const paths = getProjectPaths(projectDirectory);
        const results = await Promise.all(paths.map(p => fsExtra.pathExists(p.composerPath)));
        return results.some(exists => exists);
    }

    const findComposerDirectory = async (projectDirectory: string): Promise<string | null> => {
        const paths = getProjectPaths(projectDirectory);
        for (const p of paths) {
            if (await fsExtra.pathExists(p.composerPath)) {
                return p.dir;
            }
        }
        return null;
    }

    const all = async (): Promise<string[]> => {
        const allProjects = await fsExtra.readdir(ProjectsRoot);
        const hasComposerResults = await Promise.all(
            allProjects.map(project => hasComposerJson(project))
        );
        return allProjects.filter((_, index) => hasComposerResults[index]);
    }

    const ls = (values: string[]): void => {
        values.forEach((dir, index) => {
            console.log(`${index + 1}. ${dir}`);
        });
    }

    const cd = async (projectName: string): Promise<void> => {
        const dirToNavigate = await findComposerDirectory(projectName);

        if (!dirToNavigate) {
            throw new Error(`No composer.json found in ${projectName} or ${projectName}/${config.webRoot}`);
        }

        chdir(dirToNavigate);
        console.log(`\nMoved to: ${cwd()}`);
    }

    const dir = async (projectName: string): Promise<string> => {
        const dirToNavigate = await findComposerDirectory(projectName);
        if (!dirToNavigate) {
            throw new Error(`No composer.json found in ${projectName} or ${projectName}/${config.webRoot}`);
        }

        return dirToNavigate;
    }

    return {
        all,
        ls,
        cd,
        dir,
    }
}

export interface DirectoryScan {
    all: () => Promise<string[]>;
    ls: (values: string[]) => void;
    cd: (path: string) => Promise<void>;
    dir: (projectName: string) => Promise<string>;
}