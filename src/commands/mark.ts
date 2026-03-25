import { Command } from "commander";
import { TodoTxt } from "txtodo";

import { parseListIndices } from "../utils/parser.js";
import { promptForText } from "../utils/prompt.js";

export async function markTodos(todoFile: string, indices: number[] | "all"): Promise<void> {
    const todo = new TodoTxt({ filePath: todoFile });
    await todo.load();

    const tasks = todo.list();

    if (indices === "all") {
        for (let i = 0; i < tasks.length; i++) {
            if (!tasks[i].completed) {
                await todo.mark(i);
            }
        }
    } else {
        for (const idx of indices) {
            if (idx >= 1 && idx <= tasks.length) {
                await todo.mark(idx - 1);
            }
        }
    }

    await todo.save();
}

export function createMarkCommand(todoFile: string): Command {
    const cmd = new Command("mark");

    cmd.description("Mark todos as complete")
        .argument("[indices]", 'Indices to mark (e.g., "1,2,3" or "all")')
        .action(async (indices?: string) => {
            if (!indices) {
                indices = await promptForText("Enter indices to mark (e.g., 1,2,3 or all):");
            }

            const parsedIndices = parseListIndices(indices);
            await markTodos(todoFile, parsedIndices);
            console.log("Todos marked as complete");
        });

    return cmd;
}
