import { Command } from "commander";
import { TodoTxt } from "txtodo";

import { resolveTodoFile } from "../utils/file.js";
import { parseListIndices } from "../utils/parser.js";

export function createUnmarkCommand(): Command {
    const cmd = new Command("unmark");

    cmd.description("Mark todos as incomplete")
        .argument("[indices]", 'Indices to unmark (e.g., "1,2,3" or "all")')
        .action(async (indices?: string) => {
            const file = resolveTodoFile();

            if (!indices) {
                throw new Error("Please provide indices to unmark");
            }

            const todo = new TodoTxt({ filePath: file });
            await todo.load();

            const parsedIndices = parseListIndices(indices);
            const tasks = todo.list();

            if (parsedIndices === "all") {
                for (let i = 0; i < tasks.length; i++) {
                    if (tasks[i].completed) {
                        await todo.unmark(i);
                    }
                }
            } else {
                for (const idx of parsedIndices) {
                    if (idx < 1 || idx > tasks.length) continue;
                    await todo.unmark(idx - 1);
                }
            }

            await todo.save();
            console.log("Todos marked as incomplete");
        });

    return cmd;
}
