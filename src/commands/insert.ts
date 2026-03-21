import { Command } from "commander";
import { TodoTxt } from "txtodo";

import { resolveTodoFile } from "../utils/file.js";
import { promptForText } from "../utils/prompt.js";

export function createInsertCommand(): Command {
    const cmd = new Command("insert");

    cmd.description("Insert a todo at position")
        .argument("[index]", "Position to insert at")
        .argument("[text]", "Todo text")
        .action(async (index?: string, text?: string) => {
            const file = resolveTodoFile();

            if (!index) {
                index = await promptForText("Enter position:");
            }

            if (!text) {
                text = await promptForText("Enter todo text:");
            }

            const todo = new TodoTxt({ filePath: file });
            await todo.load();

            const idx = parseInt(index, 10);
            if (isNaN(idx) || idx < 1) {
                throw new Error("Invalid index");
            }

            await todo.insert(idx - 1, text);
            await todo.save();

            console.log("Todo inserted successfully");
        });

    return cmd;
}
