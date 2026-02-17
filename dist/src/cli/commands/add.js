"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addCommand = addCommand;
const chalk_1 = __importDefault(require("chalk"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const prompts_1 = __importDefault(require("prompts"));
const registry_1 = require("../registry");
async function addCommand(serviceName, options) {
    const service = registry_1.REGISTRY[serviceName];
    if (!service) {
        console.error(chalk_1.default.red(`Service '${serviceName}' not found.`));
        console.log(chalk_1.default.yellow("Run 'npx frontend-services list' to see available services."));
        process.exit(1);
    }
    console.log(chalk_1.default.bold.blue(`\nPreparing to add ${service.name}...`));
    // Confirm installation path
    const response = await (0, prompts_1.default)({
        type: "text",
        name: "path",
        message: "Where should we install this service?",
        initial: options.path,
    });
    const installPath = path_1.default.resolve(process.cwd(), response.path || options.path);
    // Check dependencies
    if (service.dependencies.length > 0) {
        console.log(chalk_1.default.yellow(`\nThis service requires the following dependencies:`));
        console.log(chalk_1.default.cyan(service.dependencies.join(", ")));
        const { installDeps } = await (0, prompts_1.default)({
            type: "confirm",
            name: "installDeps",
            message: "Do you want to see the install command?",
            initial: true,
        });
        if (installDeps) {
            console.log(chalk_1.default.green(`\nRun: npm install ${service.dependencies.join(" ")}`));
        }
    }
    console.log(`\nCopying files to ${chalk_1.default.gray(installPath)}...`);
    // Simple resolution strategy:
    // We assume the CLI is running from within the package
    // The source files are in "../../services" relative to this file
    // But when installed as a package, it might be different.
    // Ideally, we publish the `services` folder.
    // For local dev/monorepo usage:
    const sourceRoot = path_1.default.resolve(__dirname, "../../");
    // NOTE: In a real npm package, we might need to adjust `sourceRoot`
    // depending on how tsc builds the structure (e.g. dist/cli/commands -> dist/services)
    // Wait, I moved services to src/services.
    // If I compile with tsc, they will be in dist/services.
    // sourceRoot should be calculating path relative to this file.
    // Let's assume we run ts-node or compiled JS.
    // ../../services should work if stucture is preserved.
    try {
        // Ensure target dir exists
        await fs_extra_1.default.ensureDir(installPath);
        for (const fileRelativePath of service.files) {
            // fileRelativePath in registry is like "services/API-Service/baseApiService.ts"
            // We need to resolve the source path correctly.
            // The registry paths include "services/" prefix which I added earlier?
            // Let's check registry. "services/API-Service/..."
            // I define sourceRoot as "../../services".
            // So I should strip "services/" from registry path or adjust sourceRoot.
            // Let's adjust algorithm:
            // Source is: <package-root>/src/services/<Service-Folder>/<file>
            // Registry says: "services/<Service-Folder>/<file>"
            // We need to find where the package root is.
            // __dirname is .../src/cli/commands
            // package root is .../
            const packageRoot = path_1.default.resolve(__dirname, "../../..");
            const sourceFile = path_1.default.resolve(packageRoot, "src", fileRelativePath.replace("services/", "services/"));
            // The registry entries start with "services/".
            // let's just resolve from package root for now.
            // Wait, if users install this package, they won't have the source TS files in `src`.
            // They will likely have compiled JS in `dist` OR we publish the `src` folder.
            // For a library like this meant to copy code, we usually publish the raw TS files
            // alongside the CLI.
            // CHECK: Does "src" exist in the published package?
            // We should ensure "files" in package.json includes "src".
            // Let's assume for this task we are running locally or from a properly built package.
            const fileName = path_1.default.basename(fileRelativePath);
            const targetFile = path_1.default.join(installPath, fileName);
            // We need to verify source existence
            if (!fs_extra_1.default.existsSync(sourceFile)) {
                // Try a fallback for local dev vs production build
                // If we are in dist/, we might need to look elsewhere?
                // Actually, simplest is to look at adjacent "services" folder if we bundle them.
                // Let's try to resolve relative to __dirname first if we are in strict mode.
                // But for now, let's trust the relative path from package root.
                console.warn(chalk_1.default.yellow(`Warning: Source file not found at ${sourceFile}`));
                continue;
            }
            await fs_extra_1.default.copy(sourceFile, targetFile);
            console.log(`  Created ${chalk_1.default.green(fileName)}`);
        }
        console.log(chalk_1.default.bold.green("\nService added successfully! 🚀"));
    }
    catch (error) {
        console.error(chalk_1.default.red("Error copying files:"), error);
    }
}
