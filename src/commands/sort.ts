import { Command } from "commander";
import { TodoTxt } from "txtodo";

import { printTasks } from "../utils/display.js";
import { promptForText } from "../utils/prompt.js";

export function createSortCommand(todoFile: string): Command {
    const cmd = new Command("sort");

    cmd.description("Sort todos by key")
        .argument("[sort]", "Sort in format key:ASC|DESC")
        .action(async (sortStr?: string) => {
            const todo = new TodoTxt({ filePath: todoFile });
            await todo.load();

            if (!sortStr) {
                sortStr = await promptForText("Enter sort (e.g., priority:ASC or date:DESC):");
            }

            const parts = sortStr.split(":");
            const key = parts[0];
            let order;
            if (parts.length === 1) {
                order = "ASC";
            } else if (parts.length === 2) {
                order = parts[1];
            } else {
                console.error("Error: Sort must be in format key:ASC|DESC");
                return;
            }

            const ascending = order.toUpperCase() === "ASC";

            const tasks = todo.list();
            const sorted = [...tasks].sort((a, b) => {
                let comparison = 0;

                if (key === "priority") {
                    const prioA = a.priority || "Z";
                    const prioB = b.priority || "Z";
                    comparison = prioA.localeCompare(prioB);
                } else if (key === "date" || key === "created") {
                    const dateA = a.creationDate ? a.creationDate.toISOString() : "";
                    const dateB = b.creationDate ? b.creationDate.toISOString() : "";
                    comparison = dateA.localeCompare(dateB);
                } else if (key === "text" || key === "description") {
                    comparison = a.description.localeCompare(b.description);
                } else {
                    // Sort by extension
                    const extA = a.extensions?.[key];
                    const extB = b.extensions?.[key];
                    const valA = extA ? (Array.isArray(extA) ? extA[0] : extA) : "";
                    const valB = extB ? (Array.isArray(extB) ? extB[0] : extB) : "";
                    comparison = String(valA).localeCompare(String(valB));
                }

                return ascending ? comparison : -comparison;
            });

            if (sorted.length === 0) {
                console.log("No todos found.");
                return;
            }

            const originalIndices = sorted.map((task) => tasks.indexOf(task) + 1);
            printTasks(sorted, originalIndices);
        });

    return cmd;
}
