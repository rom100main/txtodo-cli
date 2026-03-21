import { Command } from "commander";
import { TodoTxt } from "txtodo";

import { resolveTodoFile } from "../utils/file.js";
import { promptForText } from "../utils/prompt.js";

export function createUpdateCommand(): Command {
    const cmd = new Command("update");

    cmd.description("Update a todo's text")
        .argument("[index]", "Todo index")
        .argument("[text]", "New text")
        .action(async (index?: string, text?: string) => {
            const file = resolveTodoFile();

            if (!index) {
                const indexResult = await promptForText("Enter todo index:");
                if (indexResult.cancelled) return;
                index = indexResult.text;
            }

            if (!text) {
                const textResult = await promptForText("Enter new text:");
                if (textResult.cancelled) return;
                text = textResult.text;
            }

            const todo = new TodoTxt({ filePath: file });
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
