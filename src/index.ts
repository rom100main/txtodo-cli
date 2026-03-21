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

const knownCommands = [
    "help",
    "list",
    "add",
    "subtask",
    "remove",
    "insert",
    "update",
    "mark",
    "unmark",
    "search",
    "filter",
    "sort",
    "skill",
    "complete",
    "uncomplete",
    "order",
];

const args = process.argv.slice(2);
let todoFile: string;

if (args.length > 0 && !args[0].startsWith("-") && !knownCommands.includes(args[0])) {
    todoFile = resolveTodoFile(args[0]);
    process.argv.splice(2, 1);
} else {
    todoFile = resolveTodoFile();
}

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

program.parse();
