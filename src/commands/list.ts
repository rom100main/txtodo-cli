import { Command } from "commander";
import { TodoTxt } from "txtodo";

import { printTasks } from "../utils/display.js";

export function createListCommand(todoFile: string): Command {
    const cmd = new Command("list");

    cmd.description("List all todos").action(async () => {
        const todo = new TodoTxt({ filePath: todoFile });
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
