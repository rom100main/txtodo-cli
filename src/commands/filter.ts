import { Command } from "commander";
import { TodoTxt } from "txtodo";

import { printTasks } from "../utils/display.js";
import { resolveTodoFile } from "../utils/file.js";
import { promptForText } from "../utils/prompt.js";

export function createFilterCommand(): Command {
    const cmd = new Command("filter");

    cmd.description("Filter todos by key:value or text")
        .argument("[filter]", "Filter in format key:value or text to search")
        .action(async (filterStr?: string) => {
            const file = resolveTodoFile();

            if (!filterStr) {
                filterStr = await promptForText("Enter filter (key:value or text):");
            }

            const todo = new TodoTxt({ filePath: file });
            await todo.load();

            const tasks = todo.list();
            let filtered: typeof tasks;

            // Check if it's key:value format
            if (filterStr.includes(":")) {
                const [key, value] = filterStr.split(":");
                if (!key || !value) {
                    console.error("Error: Filter must be in format key:value");
                    return;
                }

                filtered = tasks.filter((task) => {
                    if (key === "project" || key === "projects") {
                        return task.projects?.includes(value.replace("+", ""));
                    }
                    if (key === "context" || key === "contexts") {
                        return task.contexts?.includes(value.replace("@", ""));
                    }
                    if (key === "priority") {
                        return task.priority === value;
                    }
                    if (key === "completed") {
                        const completedValue = value.toLowerCase();
                        return (
                            (completedValue === "true" || completedValue === "yes" || completedValue === "y") ===
                            task.completed
                        );
                    }
                    // Check extensions
                    if (task.extensions && task.extensions[key]) {
                        const extValue = task.extensions[key];
                        if (Array.isArray(extValue)) {
                            return extValue.some((v) => String(v).toLowerCase() === value.toLowerCase());
                        }
                        return String(extValue).toLowerCase() === value.toLowerCase();
                    }
                    return false;
                });
            } else {
                // Plain text search
                filtered = tasks.filter((task) => task.description.toLowerCase().includes(filterStr!.toLowerCase()));
            }

            if (filtered.length === 0) {
                console.log("No matching todos found.");
                return;
            }

            const originalIndices = filtered.map((task) => tasks.indexOf(task) + 1);
            printTasks(filtered, originalIndices);
        });

    return cmd;
}
