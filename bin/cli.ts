#!/usr/bin/env node

import { Command } from "commander";
import { listCommand } from "../src/cli/commands/list";
import { addCommand } from "../src/cli/commands/add";

const program = new Command();

program
  .name("frontend-services")
  .description("CLI to add frontend services to your project")
  .version("1.0.0");

program
  .command("list")
  .description("List all available services")
  .action(listCommand);

program
  .command("add")
  .description("Add a service to your project")
  .argument("<service>", "Name of the service to add")
  .option("-p, --path <path>", "Path to install services", "src/services")
  .action(addCommand);

program.parse();
