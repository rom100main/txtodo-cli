#!/usr/bin/env node

import { Command } from "commander";

import { createAddCommand } from "./commands/add.js";
import { createFilterCommand } from "./commands/filter.js";
import { createHelpCommand } from "./commands/help.js";
import { createInsertCommand } from "./commands/insert.js";
import { createListCommand } from "./commands/list.js";
import { createMarkCommand } from "./commands/mark.js";
import { createRemoveCommand } from "./commands/remove.js";
import { createSearchCommand } from "./commands/search.js";
import { createSkillCommand } from "./commands/skill.js";
import { createSortCommand } from "./commands/sort.js";
import { createSubtaskCommand } from "./commands/subtask.js";
import { createUnmarkCommand } from "./commands/unmark.js";
import { createUpdateCommand } from "./commands/update.js";
import { resolveTodoFile } from "./utils/file.js";

const chainableCommands = [
    "search",
    "filter",
    "sort",
    "remove",
    "mark",
    "unmark",
    "update",
    "subtask",
    "add",
    "insert",
];

const args = process.argv.slice(2);
let todoFile: string;
let hasChain = false;
let chainArgs: string[] = [];
let processArgs = args;

if (args.length > 0) {
    const commandWords = args.filter((arg) => !arg.startsWith("-"));
    const chainableCount = commandWords.filter((word) => chainableCommands.includes(word)).length;
    hasChain = chainableCount > 1;

    const firstWord = commandWords[0];
    const isFileArg = firstWord.endsWith(".txt") || firstWord.includes("/");

    if (isFileArg) {
        const fileArgIndex = args.indexOf(firstWord);
        todoFile = resolveTodoFile(firstWord);
        processArgs = [...args.slice(0, fileArgIndex), ...args.slice(fileArgIndex + 1)];
        if (hasChain) {
            chainArgs = processArgs;
        }
    } else {
        todoFile = resolveTodoFile();
        if (hasChain) {
            chainArgs = args;
        }
    }
} else {
    todoFile = resolveTodoFile();
}

if (hasChain && chainArgs.length > 0) {
    import("./utils/chain.js")
        .then(async ({ executeChain }) => {
            const steps: import("./utils/chain.js").ChainStep[] = [];
            let currentType: import("./utils/chain.js").ChainStep["type"] | null = null;
            let currentArgs: string[] = [];

            for (const arg of chainArgs) {
                if (chainableCommands.includes(arg)) {
                    if (currentType) {
                        steps.push({ type: currentType, args: currentArgs });
                    }
                    currentType = arg as import("./utils/chain.js").ChainStep["type"];
                    currentArgs = [];
                } else {
                    currentArgs.push(arg);
                }
            }

            if (currentType) {
                steps.push({ type: currentType, args: currentArgs });
            }

            await executeChain(todoFile, steps);
        })
        .catch((error) => {
            console.error(`Error: ${(error as Error).message}`);
            process.exit(1);
        });
} else {
    const program = new Command();

    program.name("txtodo").description("A CLI for managing todo.txt files").version("1.1.1");

    program.addCommand(createHelpCommand());
    program.addCommand(createListCommand(todoFile));
    program.addCommand(createAddCommand(todoFile));
    program.addCommand(createSubtaskCommand(todoFile));
    program.addCommand(createRemoveCommand(todoFile));
    program.addCommand(createInsertCommand(todoFile));
    program.addCommand(createUpdateCommand(todoFile));
    program.addCommand(createMarkCommand(todoFile));
    program.addCommand(createUnmarkCommand(todoFile));
    program.addCommand(createSearchCommand(todoFile));
    program.addCommand(createFilterCommand(todoFile));
    program.addCommand(createSortCommand(todoFile));
    program.addCommand(createSkillCommand());

    program.parse(processArgs.length > 0 ? [process.argv[0], process.argv[1], ...processArgs] : undefined);
}
