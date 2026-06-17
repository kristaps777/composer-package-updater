import fs from 'fs';
import path from 'path';
import chalk from "chalk";

const source = path.join(process.cwd(), '.env-dist');
const destination = path.join(process.cwd(), '.env');

if (fs.existsSync(destination)) {
    console.log('.env already exists, skipping...');
    process.exit(0);
}

if (!fs.existsSync(source)) {
    console.warn('.env-dist not found, skipping...');
    process.exit(0);
}

try {
    fs.copyFileSync(source, destination);
    console.log(chalk.green('.env created from .env-dist'));
    console.log(chalk.yellow('Please make sure to set PROJECTS_ROOT in .env!'));
} catch (error) {
    console.error('Failed to copy .env-dist:', error.message);
    process.exit(1);
}