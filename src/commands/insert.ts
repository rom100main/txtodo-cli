import { Command } from "commander";
import { TodoTxt } from "txtodo";

import { promptForText } from "../utils/prompt.js";

export async function insertTodo(todoFile: string, index: number, text: string): Promise<void> {
    const todo = new TodoTxt({ filePath: todoFile });
    await todo.load();

    await todo.insert(index - 1, text);
    await todo.save();
}

export function createInsertCommand(todoFile: string): Command {
    const cmd = new Command("insert");

    cmd.description("Insert a todo at position")
        .argument("[index]", "Position to insert at")
        .argument("[text]", "Todo text")
        .action(async (index?: string, text?: string) => {
            if (!index) {
                index = await promptForText("Enter position:");
            }

            if (!text) {
                text = await promptForText("Enter todo text:");
            }

            const idx = parseInt(index, 10);
            if (isNaN(idx) || idx < 1) {
                throw new Error("Invalid index");
            }

            await insertTodo(todoFile, idx, text);
            console.log("Todo inserted successfully");
        });

    return cmd;
}
