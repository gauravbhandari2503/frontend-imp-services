#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const list_1 = require("../src/cli/commands/list");
const add_1 = require("../src/cli/commands/add");
const program = new commander_1.Command();
program
    .name("frontend-services")
    .description("CLI to add frontend services to your project")
    .version("1.0.0");
program
    .command("list")
    .description("List all available services")
    .action(list_1.listCommand);
program
    .command("add")
    .description("Add a service to your project")
    .argument("<service>", "Name of the service to add")
    .option("-p, --path <path>", "Path to install services", "src/services")
    .action(add_1.addCommand);
program.parse();
