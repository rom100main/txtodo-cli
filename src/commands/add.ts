import { Command } from "commander";
import { TodoTxt } from "txtodo";

import { resolveTodoFile } from "../utils/file.js";
import { promptForText } from "../utils/prompt.js";

export function createAddCommand(): Command {
    const cmd = new Command("add");

    cmd.description("Add a new todo")
        .argument("[index]", "Index to insert at (optional)")
        .argument("[text]", "Todo text")
        .action(async (index?: string, text?: string) => {
            const file = resolveTodoFile();
            const todo = new TodoTxt({ filePath: file });
            await todo.load();

            // If only one argument provided, treat it as text
            if (!text && index) {
                text = index;
                index = undefined;
            }

            if (!text) {
                text = await promptForText("What needs to be done?");
            }

            if (index) {
                const idx = parseInt(index, 10);
                if (isNaN(idx) || idx < 1) {
                    console.error("Error: Invalid index");
                    return;
                }
                await todo.insert(idx - 1, text);
            } else {
                await todo.add(text);
            }

            await todo.save();

            console.log("Todo added successfully");
        });

    return cmd;
}
