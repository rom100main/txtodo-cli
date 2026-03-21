import { Command } from "commander";
import { TodoTxt } from "txtodo";

import { resolveTodoFile } from "../utils/file.js";
import { parseListIndices, getFirstIndex } from "../utils/parser.js";
import { promptForText } from "../utils/prompt.js";

export function createSubtaskCommand(): Command {
    const cmd = new Command("subtask");

    cmd.description("Add a subtask to a todo")
        .argument("[index]", "Todo index")
        .argument("[text]", "Subtask text")
        .action(async (index?: string, text?: string) => {
            const file = resolveTodoFile();

            if (!index) {
                const indexResult = await promptForText("Enter todo index:");
                if (indexResult.cancelled) return;
                index = indexResult.text;
            }

            if (!text) {
                const textResult = await promptForText("Enter subtask text:");
                if (textResult.cancelled) return;
                text = textResult.text;
            }

            const todo = new TodoTxt({ filePath: file });
            await todo.load();

            const indices = parseListIndices(index);
            const firstIndex = getFirstIndex(indices);

            if (firstIndex === null) {
                throw new Error("Invalid index for subtask");
            }

            const tasks = todo.list();
            if (firstIndex < 1 || firstIndex > tasks.length) {
                throw new Error(`Index ${firstIndex} out of range`);
            }

            const subtaskText = "    " + text;

            await todo.insert(firstIndex, subtaskText);
            await todo.save();

            console.log("Subtask added successfully");
        });

    return cmd;
}
