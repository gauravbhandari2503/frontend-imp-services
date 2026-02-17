"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listCommand = listCommand;
const chalk_1 = __importDefault(require("chalk"));
const registry_1 = require("../registry");
async function listCommand() {
    console.log(chalk_1.default.bold.blue("\nAvailable Services:\n"));
    for (const [key, service] of Object.entries(registry_1.REGISTRY)) {
        console.log(`${chalk_1.default.green(key)}: ${service.name}`);
        console.log(`  ${chalk_1.default.gray(service.description)}`);
        if (service.dependencies.length > 0) {
            console.log(`  Dependencies: ${chalk_1.default.yellow(service.dependencies.join(", "))}`);
        }
        console.log("");
    }
}
