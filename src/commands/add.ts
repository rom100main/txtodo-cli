import { Command } from "commander";
import { TodoTxt } from "txtodo";

import { promptForText } from "../utils/prompt.js";

export async function addTodo(todoFile: string, text: string, index?: number | null): Promise<void> {
    const todo = new TodoTxt({ filePath: todoFile });
    await todo.load();

    if (index !== undefined && index !== null && index >= 1) {
        await todo.insert(index - 1, text);
    } else {
        await todo.add(text);
    }

    await todo.save();
}

export function createAddCommand(todoFile: string): Command {
    const cmd = new Command("add");

    cmd.description("Add a new todo")
        .argument("[index]", "Index to insert at (optional)")
        .argument("[text]", "Todo text")
        .action(async (index?: string, text?: string) => {
            if (!text && index) {
                text = index;
                index = undefined;
            }

            if (!text) {
                text = await promptForText("Enter todo text:");
            }

            let idx: number | null = null;
            if (index) {
                idx = parseInt(index, 10);
                if (isNaN(idx) || idx < 1) {
                    console.error("Error: Invalid index");
                    return;
                }
            }

            await addTodo(todoFile, text, idx);
            console.log("Todo added successfully");
        });

    return cmd;
}
