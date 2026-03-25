import { Command } from "commander";
import { TodoTxt } from "txtodo";

import { parseListIndices } from "../utils/parser.js";
import { promptForText } from "../utils/prompt.js";

export async function unmarkTodos(todoFile: string, indices: number[] | "all"): Promise<void> {
    const todo = new TodoTxt({ filePath: todoFile });
    await todo.load();

    const tasks = todo.list();

    if (indices === "all") {
        for (let i = 0; i < tasks.length; i++) {
            if (tasks[i].completed) {
                await todo.unmark(i);
            }
        }
    } else {
        for (const idx of indices) {
            if (idx >= 1 && idx <= tasks.length) {
                await todo.unmark(idx - 1);
            }
        }
    }

    await todo.save();
}

export function createUnmarkCommand(todoFile: string): Command {
    const cmd = new Command("unmark");

    cmd.description("Mark todos as incomplete")
        .argument("[indices]", 'Indices to unmark (e.g., "1,2,3" or "all")')
        .action(async (indices?: string) => {
            if (!indices) {
                indices = await promptForText("Enter indices to unmark (e.g., 1,2,3 or all):");
            }

            const parsedIndices = parseListIndices(indices);
            await unmarkTodos(todoFile, parsedIndices);
            console.log("Todos marked as incomplete");
        });

    return cmd;
}
