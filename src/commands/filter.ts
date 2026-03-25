import { Command } from "commander";
import { Task, TodoTxt } from "txtodo";

import { printTasks } from "../utils/display.js";
import { promptForText } from "../utils/prompt.js";

export function filterTasks(tasks: Task[], keyOrText: string, value?: string): number[] {
    if (value !== undefined) {
        if (keyOrText === "project" || keyOrText === "projects") {
            return tasks
                .map((task, index) => ({ task, index: index + 1 }))
                .filter(({ task }) => task.projects?.includes(value.replace("+", "")))
                .map(({ index }) => index);
        }
        if (keyOrText === "context" || keyOrText === "contexts") {
            return tasks
                .map((task, index) => ({ task, index: index + 1 }))
                .filter(({ task }) => task.contexts?.includes(value.replace("@", "")))
                .map(({ index }) => index);
        }
        if (keyOrText === "priority") {
            return tasks
                .map((task, index) => ({ task, index: index + 1 }))
                .filter(({ task }) => task.priority === value)
                .map(({ index }) => index);
        }
        if (keyOrText === "completed") {
            const completedValue = value.toLowerCase();
            const isCompleted = completedValue === "true" || completedValue === "yes" || completedValue === "y";
            return tasks
                .map((task, index) => ({ task, index: index + 1 }))
                .filter(({ task }) => isCompleted === task.completed)
                .map(({ index }) => index);
        }
        return tasks
            .map((task, index) => ({ task, index: index + 1 }))
            .filter(({ task }) => {
                if (task.extensions && task.extensions[keyOrText]) {
                    const extValue = task.extensions[keyOrText];
                    if (Array.isArray(extValue)) {
                        return extValue.some((v) => String(v).toLowerCase() === value.toLowerCase());
                    }
                    return String(extValue).toLowerCase() === value.toLowerCase();
                }
                return false;
            })
            .map(({ index }) => index);
    } else {
        return tasks
            .map((task, index) => ({ task, index: index + 1 }))
            .filter(({ task }) => task.description.toLowerCase().includes(keyOrText.toLowerCase()))
            .map(({ index }) => index);
    }
}

export function createFilterCommand(todoFile: string): Command {
    const cmd = new Command("filter");

    cmd.description("Filter todos by key:value or text")
        .argument("[filter]", "Filter in format key:value or text to search")
        .action(async (filterStr?: string) => {
            const todo = new TodoTxt({ filePath: todoFile });
            await todo.load();

            if (!filterStr) {
                filterStr = await promptForText("Enter filter (key:value or text):");
            }

            const tasks = todo.list();
            let indices: number[];

            if (filterStr.includes(":")) {
                const [key, value] = filterStr.split(":");
                if (!key || !value) {
                    console.error("Error: Filter must be in format key:value");
                    return;
                }
                indices = filterTasks(tasks, key, value);
            } else {
                indices = filterTasks(tasks, filterStr);
            }

            if (indices.length === 0) {
                console.log("No matching todos found.");
                return;
            }

            const filtered = indices.map((i) => tasks[i - 1]);
            printTasks(filtered, indices);
        });

    return cmd;
}
