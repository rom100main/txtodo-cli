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
    const markdown = `# TxTodo CLI

A command-line interface for managing todo.txt files.

## Installation

\`\`\`bash
npm install -g txtodo-cli
\`\`\`

## Usage

\`\`\`bash
txtodo [file] <command> [options]
\`\`\`

## Commands

### list
List all todos from the todo.txt file.

\`\`\`bash
txtodo list
\`\`\`

### add
Add a new todo item.

\`\`\`bash
txtodo add "Buy groceries"
\`\`\`

### subtask
Add a subtask to an existing todo.

\`\`\`bash
txtodo subtask 1 "Call mom"
txtodo subtask subtask 1 "Nested subtask"
txtodo subtask subtask subtask 1 "Deep nested subtask"
\`\`\`

Each additional \`subtask\` keyword adds one level of indentation (4 spaces).

### remove
Remove one or more todos by index.

\`\`\`bash
txtodo remove 1
txtodo remove 1,2,3
txtodo remove all
\`\`\`

### insert
Insert a todo at a specific position.

\`\`\`bash
txtodo insert 1 "Urgent task"
\`\`\`

### update
Update the text of a todo.

\`\`\`bash
txtodo update 1 "Updated task description"
\`\`\`

### mark
Mark todos as complete (adds 'x' prefix).

\`\`\`bash
txtodo mark 1
txtodo mark all
\`\`\`

### unmark
Mark todos as incomplete (removes 'x' prefix).

\`\`\`bash
txtodo unmark 1
txtodo unmark all
\`\`\`

### search
Search todos by text content.

\`\`\`bash
txtodo search "urgent"
\`\`\`

### filter
Filter todos by key:value pairs (projects, contexts, etc.).

\`\`\`bash
txtodo filter project:Home
txtodo filter context:@phone
\`\`\`

### sort
Sort todos by key in ascending or descending order.

\`\`\`bash
txtodo sort priority:ASC
txtodo sort date:DESC
\`\`\`

### skill
Create a minimal AI agent skill file at \`./.agents/skills/txtodo/SKILL.md\`.

\`\`\`bash
txtodo skill
\`\`\`

### skill max
Create a comprehensive AI agent skill file.

\`\`\`bash
txtodo skill max
\`\`\`

## Command Chaining

You can chain commands to filter, sort, and then perform actions:

\`\`\`bash
txtodo filter project:Home remove
txtodo search "urgent" update "new priority"
txtodo filter context:@phone subtask "call back"
\`\`\`

## Custom File

By default, txtodo works with \`todo.txt\` in the current directory. You can specify a different file:

\`\`\`bash
txtodo ./work.txt list
txtodo /path/to/file.txt add "task"
\`\`\`

## List Index Format

- Single index: \`1\`
- Multiple indices: \`1,2,3\`
- All indices: \`all\`

## Interactive Mode

When a command requires values but none is provided, txtodo will prompt you for input.
`;

    console.log(markdown);
}
