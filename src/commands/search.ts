import { Command } from "commander";
import { TodoTxt } from "txtodo";

import { printTasks } from "../utils/display.js";
import { resolveTodoFile } from "../utils/file.js";
import { promptForText } from "../utils/prompt.js";

export function createSearchCommand(): Command {
    const cmd = new Command("search");

    cmd.description("Search todos by text")
        .argument("[text]", "Search text")
        .action(async (text?: string) => {
            const file = resolveTodoFile();

            if (!text) {
                const result = await promptForText("Enter search text:");
                if (result.cancelled) return;
                text = result.text;
            }

            const todo = new TodoTxt({ filePath: file });
            await todo.load();

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
