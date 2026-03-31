import { Command } from "commander";
import { TodoTxt } from "txtodo";

import { parseListIndices, getFirstIndex } from "../utils/parser.js";
import { promptForText } from "../utils/prompt.js";

export async function addSubtask(todoFile: string, index: number, text: string, chainDepth = 1): Promise<void> {
    const todo = new TodoTxt({ filePath: todoFile });
    await todo.load();

    const tasks = todo.list();
    if (index < 1 || index > tasks.length) {
        throw new Error(`Index ${index} out of range`);
    }

    const targetTask = tasks[index - 1];
    const parentIndent = targetTask.indentLevel || 0;
    const maxDepth = parentIndent + 4;
    const desiredIndent = chainDepth * 4;
    const actualIndent = Math.min(desiredIndent, maxDepth);

    const subtaskText = " ".repeat(actualIndent) + text;
    await todo.insert(index - 1, subtaskText);
    await todo.save();
}

export function createSubtaskCommand(todoFile: string, chainDepth = 1): Command {
    const cmd = new Command("subtask");

    cmd.description("Add a subtask to a todo")
        .argument("[index]", "Todo index")
        .argument("[text]", "Subtask text")
        .action(async (index?: string, text?: string) => {
            if (!index) {
                index = await promptForText("Enter todo index:");
            }

            if (!text) {
                text = await promptForText("Enter subtask text:");
            }

            const indices = parseListIndices(index);
            const firstIndex = getFirstIndex(indices);

            if (firstIndex === null) {
                throw new Error("Invalid index for subtask");
            }

            await addSubtask(todoFile, firstIndex, text, chainDepth);
            console.log("Subtask added successfully");
        });

    return cmd;
}
