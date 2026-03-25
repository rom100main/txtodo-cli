import { Command } from "commander";
import { TodoTxt } from "txtodo";

import { parseListIndices } from "../utils/parser.js";
import { promptForText } from "../utils/prompt.js";

export async function removeTodos(todoFile: string, indices: number[] | "all"): Promise<void> {
    const todo = new TodoTxt({ filePath: todoFile });
    await todo.load();

    const tasks = todo.list();

    if (indices === "all") {
        for (let i = tasks.length - 1; i >= 0; i--) {
            await todo.remove(i);
        }
    } else {
        const sortedIndices = indices.map((i) => i - 1).sort((a, b) => b - a);
        for (const idx of sortedIndices) {
            if (idx >= 0 && idx < tasks.length) {
                await todo.remove(idx);
            }
        }
    }

    await todo.save();
}

export function createRemoveCommand(todoFile: string): Command {
    const cmd = new Command("remove");

    cmd.description("Remove todos by index")
        .argument("[indices]", 'Indices to remove (e.g., "1,2,3" or "all")')
        .action(async (indices?: string) => {
            if (!indices) {
                indices = await promptForText("Enter indices to remove (e.g., 1,2,3 or all):");
            }

            const parsedIndices = parseListIndices(indices);
            await removeTodos(todoFile, parsedIndices);
            console.log("Todos removed successfully");
        });

    return cmd;
}
