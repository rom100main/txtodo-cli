import { Command } from "commander";
import { TodoTxt } from "txtodo";

import { printTasks } from "../utils/display.js";
import { promptForText } from "../utils/prompt.js";

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
            const filtered = tasks.filter((task) => task.description.toLowerCase().includes(text.toLowerCase()));

            if (filtered.length === 0) {
                console.log("No matching todos found.");
                return;
            }

            const originalIndices = filtered.map((task) => tasks.indexOf(task) + 1);
            printTasks(filtered, originalIndices, { highlightText: text });
        });

    return cmd;
}
