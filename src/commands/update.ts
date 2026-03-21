import { Command } from "commander";
import { TodoTxt } from "txtodo";

import { promptForText } from "../utils/prompt.js";

export function createUpdateCommand(todoFile: string): Command {
    const cmd = new Command("update");

    cmd.description("Update a todo's text")
        .argument("[index]", "Todo index")
        .argument("[text]", "New text")
        .action(async (index?: string, text?: string) => {
            if (!index) {
                index = await promptForText("Enter todo index:");
            }

            if (!text) {
                text = await promptForText("Enter new text:");
            }

            const todo = new TodoTxt({ filePath: todoFile });
            await todo.load();

            const idx = parseInt(index, 10);
            if (isNaN(idx) || idx < 1) {
                throw new Error("Invalid index");
            }

            await todo.update(idx - 1, { description: text });
            await todo.save();

            console.log("Todo updated successfully");
        });

    return cmd;
}
