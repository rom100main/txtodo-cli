import { Command } from "commander";
import { TodoTxt } from "txtodo";

import { resolveTodoFile } from "../utils/file.js";
import { parseListIndices } from "../utils/parser.js";
import { promptForText } from "../utils/prompt.js";

export function createMarkCommand(): Command {
    const cmd = new Command("mark");

    cmd.description("Mark todos as complete")
        .argument("[indices]", 'Indices to mark (e.g., "1,2,3" or "all")')
        .action(async (indices?: string) => {
            const file = resolveTodoFile();

            if (!indices) {
                indices = await promptForText("Enter indices to mark (e.g., 1,2,3 or all):");
            }

            const todo = new TodoTxt({ filePath: file });
            await todo.load();

            const parsedIndices = parseListIndices(indices);
            const tasks = todo.list();

            if (parsedIndices === "all") {
                for (let i = 0; i < tasks.length; i++) {
                    if (!tasks[i].completed) {
                        await todo.mark(i);
                    }
                }
            } else {
                for (const idx of parsedIndices) {
                    if (idx < 1 || idx > tasks.length) continue;
                    await todo.mark(idx - 1);
                }
            }

            await todo.save();
            console.log("Todos marked as complete");
        });

    return cmd;
}
