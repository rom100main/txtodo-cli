import { Command } from "commander";
import { TodoTxt } from "txtodo";

import { promptForText } from "../utils/prompt.js";

export async function updateTodo(todoFile: string, index: number, text: string): Promise<void> {
    const todo = new TodoTxt({ filePath: todoFile });
    await todo.load();

    await todo.update(index - 1, { description: text });
    await todo.save();
}

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

            const idx = parseInt(index, 10);
            if (isNaN(idx) || idx < 1) {
                throw new Error("Invalid index");
            }

            await updateTodo(todoFile, idx, text);
            console.log("Todo updated successfully");
        });

    return cmd;
}
