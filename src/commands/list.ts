import { Command } from "commander";
import { TodoTxt } from "txtodo";

import { resolveTodoFile } from "../utils/file.js";

export function createListCommand(): Command {
    const cmd = new Command("list");

    cmd.description("List all todos").action(async () => {
        const file = resolveTodoFile();
        const todo = new TodoTxt({ filePath: file });
        await todo.load();

        const tasks = todo.list();

        if (tasks.length === 0) {
            console.log("No todos found.");
            return;
        }

        tasks.forEach((task, index) => {
            const lineNum = index + 1;
            const completed = task.completed ? "x" : " ";
            const priority = task.priority ? `(${task.priority})` : " ";
            const indent = task.indentLevel && task.indentLevel > 0 ? "└─ " : "";
            const text = task.description;

            console.log(`${lineNum}. [${completed}] ${priority} ${indent}${text}`);
        });
    });

    return cmd;
}
