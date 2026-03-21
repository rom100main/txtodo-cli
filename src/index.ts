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

const program = new Command();

program.name("txtodo").description("A CLI for managing todo.txt files").version("1.1.1");

program.addCommand(createHelpCommand());
program.addCommand(createListCommand());
program.addCommand(createAddCommand());
program.addCommand(createSubtaskCommand());
program.addCommand(createRemoveCommand());
program.addCommand(createInsertCommand());
program.addCommand(createUpdateCommand());
program.addCommand(createMarkCommand());
program.addCommand(createUnmarkCommand());
program.addCommand(createSearchCommand());
program.addCommand(createFilterCommand());
program.addCommand(createSortCommand());
program.addCommand(createSkillCommand());

program.parse();
