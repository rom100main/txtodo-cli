import { Command } from "commander";
import { TodoTxt } from "txtodo";

import { printTasks } from "../utils/display.js";
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

        const indices = tasks.map((_, i) => i + 1);
        printTasks(tasks, indices);
    });

    return cmd;
}
