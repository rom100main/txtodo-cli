import { Command } from "commander";
import { Task, TodoTxt } from "txtodo";

import { printTasks } from "../utils/display.js";
import { promptForText } from "../utils/prompt.js";

export function searchTasks(tasks: Task[], text: string): number[] {
    return tasks
        .map((task, index) => ({ task, index: index + 1 }))
        .filter(({ task }) => task.description.toLowerCase().includes(text.toLowerCase()))
        .map(({ index }) => index);
}

export function createSearchCommand(todoFile: string): Command {
    const cmd = new Command("search");

    cmd.description("Search todos by text")
        .argument("[text]", "Search text")
        .action(async (text?: string) => {
            const todo = new TodoTxt({ filePath: todoFile });
            await todo.load();

            if (!text) {
                text = await promptForText("Enter search text:");
            }

            const tasks = todo.list();
            const indices = searchTasks(tasks, text);
            const filtered = indices.map((i) => tasks[i - 1]);

            if (filtered.length === 0) {
                console.log("No matching todos found.");
                return;
            }

            printTasks(filtered, indices, { highlightText: text });
        });

    return cmd;
}
