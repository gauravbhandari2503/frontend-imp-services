import chalk from "chalk";
import { REGISTRY } from "../registry";

export async function listCommand() {
  console.log(chalk.bold.blue("\nAvailable Services:\n"));

  for (const [key, service] of Object.entries(REGISTRY)) {
    console.log(`${chalk.green(key)}: ${service.name}`);
    console.log(`  ${chalk.gray(service.description)}`);

    if (service.dependencies.length > 0) {
      console.log(
        `  Dependencies: ${chalk.yellow(service.dependencies.join(", "))}`,
      );
    }
    console.log("");
  }
}
