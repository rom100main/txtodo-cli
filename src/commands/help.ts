import { readFileSync } from "fs";
import { join } from "path";

import { Command } from "commander";

export function createHelpCommand(): Command {
    const cmd = new Command("help");

    cmd.description("Show help information")
        .argument("[topic]", 'Help topic (e.g., "markdown")')
        .action((topic?: string) => {
            if (topic === "markdown") {
                showMarkdownHelp();
            } else {
                showHelp();
            }
        });

    return cmd;
}

function showHelp(): void {
    const helpText = `
txtodo - A CLI for managing todo.txt files

Usage:
  txtodo [file] <command> [options]

Commands:
  list                      List all todos
  add <text>                Add a new todo
  subtask <index> <text>    Add a subtask to a todo
  subtask subtask ...       Add nested subtask (chain for depth)
  remove <list index>       Remove todos by index
  insert <index> <text>     Insert a todo at position
  update <index> <text>     Update a todo's text
  mark <list index>         Mark todos as complete
  unmark <list index>       Mark todos as incomplete
  search <text>             Search todos by text
  filter <key>:<value>      Filter todos by key:value
  sort <key>:<ASC|DESC>     Sort todos by key
  skill                     Create minimal AI agent skill
  skill max                 Create comprehensive AI agent skill

List Index Format:
  Single: 1
  Multiple: 1,2,3
  All: all

Command Chaining:
  txtodo filter project:Home sort priority:ASC
  txtodo search "urgent" mark
`;

    console.log(helpText);
}

function showMarkdownHelp(): void {
    const docsPath = join(__dirname, "../../DOCS.md");
    try {
        const markdown = readFileSync(docsPath, "utf-8");
        console.log(markdown);
    } catch (error) {
        console.error("Error reading DOCS.md:", error);
    }
}
