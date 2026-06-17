export interface Configuration {
    projectsRoot: string;
    composerJson: string;
    webRoot: string;
    ticketStub: string;
    branchStub: string;
    composer: ComposerCommands;
    git: GitCommands;
    prompts: Prompts;
}

export interface Prompts {
    getProject: string;
    getTicket: string;
}

export interface ComposerCommands {
    audit: string;
    update: string;
}

export interface GitCommands {
    checkout: string;
    commit: string;
    createBranch: string;
    diff: string;
    fetchOrigin: string;
    reset: string;
    showRef: string;
    push: string;
    status: string;
}

export interface ComposerOutput {
    advisories: {
        [packageName: string]: Advisory;
    };
    abandoned: string[];
}

export interface Advisory {
    advisoryId: string;
    packageName: string;
    affectedVersions: string;
    title: string;
    cve: null | string;
    link: string;
    reportedAt: string;
    sources: any[];
    severity: string;
}

export const config: Configuration = {
    projectsRoot: process.env.PROJECTS_ROOT || '',
    composerJson: 'composer.json',
    webRoot: 'web',
    ticketStub: 'ONE-%s',
    branchStub: '%s-package-updates',
    composer: {
        audit: 'composer audit --format=json',
        update: 'composer update',
    },
    git: {
        checkout: 'git checkout',
        createBranch: 'git checkout -b %s',
        commit: 'git commit -a -m "%s"',
        diff: 'git diff --stat',
        fetchOrigin: 'git fetch origin',
        reset: 'git reset --hard origin/%s',
        showRef: 'git show-ref --verify --quiet refs/heads/%s',
        push: 'git push -u origin %s',
        status: 'git status --porcelain',
    },
    prompts: {
        getProject: process.env.GET_PROJECT_PROMPT || '',
        getTicket: process.env.GET_TICKET_PROMPT || '',
    },
};
