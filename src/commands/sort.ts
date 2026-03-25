import { Command } from "commander";
import { Task, TodoTxt } from "txtodo";

import { printTasks } from "../utils/display.js";
import { promptForText } from "../utils/prompt.js";

export function sortTasks(tasks: Task[], key: string, order: "ASC" | "DESC"): number[] {
    const ascending = order === "ASC";
    const indices = tasks.map((_, i) => i + 1);

    return indices.sort((a, b) => {
        const taskA = tasks[a - 1];
        const taskB = tasks[b - 1];
        let comparison = 0;

        if (key === "priority") {
            const prioA = taskA.priority || "Z";
            const prioB = taskB.priority || "Z";
            comparison = prioA.localeCompare(prioB);
        } else if (key === "date" || key === "created") {
            const dateA = taskA.creationDate ? taskA.creationDate.toISOString() : "";
            const dateB = taskB.creationDate ? taskB.creationDate.toISOString() : "";
            comparison = dateA.localeCompare(dateB);
        } else if (key === "text" || key === "description") {
            comparison = taskA.description.localeCompare(taskB.description);
        } else {
            const extA = taskA.extensions?.[key];
            const extB = taskB.extensions?.[key];
            const valA = extA ? (Array.isArray(extA) ? extA[0] : extA) : "";
            const valB = extB ? (Array.isArray(extB) ? extB[0] : extB) : "";
            comparison = String(valA).localeCompare(String(valB));
        }

        return ascending ? comparison : -comparison;
    });
}

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
            let order: "ASC" | "DESC" = "ASC";
            if (parts.length === 1) {
                order = "ASC";
            } else if (parts.length === 2) {
                order = parts[1].toUpperCase() as "ASC" | "DESC";
            } else {
                console.error("Error: Sort must be in format key:ASC|DESC");
                return;
            }

            const tasks = todo.list();
            const sortedIndices = sortTasks(tasks, key, order);
            const sorted = sortedIndices.map((i) => tasks[i - 1]);

            if (sorted.length === 0) {
                console.log("No todos found.");
                return;
            }

            printTasks(sorted, sortedIndices);
        });

    return cmd;
}
