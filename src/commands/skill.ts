import fs from "fs";
import path from "path";

import { Command } from "commander";

import { ensureDirectory } from "../utils/file.js";

export function createSkillCommand(): Command {
    const cmd = new Command("skill");

    cmd.description("Create AI agent skill file")
        .argument("[mode]", 'Skill mode: "max" for comprehensive')
        .action((mode?: string) => {
            const skillDir = "./.agents/skills/txtodo";
            ensureDirectory(skillDir);

            const skillPath = path.resolve(skillDir, "SKILL.md");

            let content: string;

            if (mode === "max") {
                content = generateMaxSkill();
            } else {
                content = generateBasicSkill();
            }

            fs.writeFileSync(skillPath, content, "utf-8");
            console.log(`Skill file created at ${skillPath}`);
        });

    return cmd;
}

function generateBasicSkill(): string {
    return `# txtodo Skill

## Basic Commands

### Add a todo
\`\`\`bash
txtodo add "task description"
\`\`\`

### List todos
\`\`\`bash
txtodo list
\`\`\`

### Complete a todo
\`\`\`bash
txtodo mark <index>
\`\`\`

### Remove a todo
\`\`\`bash
txtodo remove <index>
\`\`\`

### Insert at position
\`\`\`bash
txtodo insert <index> "task"
\`\`\`

### Update a todo
\`\`\`bash
txtodo update <index> "new text"
\`\`\`

## Index Format
- Single: \`1\`
- Multiple: \`1,2,3\`
- All: \`all\`
`;
}

function generateMaxSkill(): string {
    return `# txtodo Skill - Complete Reference

## Overview
txtodo is a CLI for managing todo.txt files with support for filtering, sorting, and command chaining.

## Basic Commands

### Add a todo
\`\`\`bash
txtodo add "task description"
\`\`\`

### List todos
\`\`\`bash
txtodo list
\`\`\`

### Insert at position
\`\`\`bash
txtodo insert <index> "task"
\`\`\`

### Update a todo
\`\`\`bash
txtodo update <index> "new text"
\`\`\`

### Remove todos
\`\`\`bash
txtodo remove <indices>
txtodo remove all
\`\`\`

### Add subtask
\`\`\`bash
txtodo subtask <index> "subtask text"
\`\`\`

## Status Commands

### Mark as complete
\`\`\`bash
txtodo mark <indices>
txtodo mark all
\`\`\`

### Mark as incomplete
\`\`\`bash
txtodo unmark <indices>
txtodo unmark all
\`\`\`

## Query Commands

### Search by text
\`\`\`bash
txtodo search "text"
\`\`\`

### Filter by key:value
\`\`\`bash
txtodo filter project:Home
txtodo filter context:@phone
txtodo filter priority:A
\`\`\`

### Sort todos
\`\`\`bash
txtodo sort priority:ASC
txtodo sort priority:DESC
txtodo sort date:ASC
\`\`\`

## Command Chaining

Chain filter/sort with actions:

\`\`\`bash
txtodo filter project:Home remove
txtodo search "urgent" update "new priority"
txtodo filter context:@phone subtask "call back"
txtodo filter project:Work sort priority:DESC
\`\`\`

## Index Format
- Single: \`1\`
- Multiple: \`1,2,3\`
- All: \`all\`

## Custom File
\`\`\`bash
txtodo ./work.txt list
txtodo /path/to/file.txt add "task"
\`\`\`

## todo.txt Format

### Task Structure
\`\`\`
(PRIORITY) DATE DESCRIPTION +PROJECT @CONTEXT key:value
\`\`\`

### Examples
\`\`\`
(A) 2024-01-15 Call Mom +Family @phone due:2024-01-16
(B) Schedule appointment +Work
x 2024-01-15 (A) 2024-01-14 Completed task
\`\`\`

### Priorities
- (A) through (Z), with (A) being highest priority

### Projects and Contexts
- Projects: \`+ProjectName\`
- Contexts: \`@context\`

### Extensions
- Custom key:value pairs
- Dates: \`due:2024-01-16\`
- Numbers: \`estimate:2h\`
`;
}
