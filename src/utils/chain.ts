import { Task, TodoTxt } from "txtodo";

import { addTodo } from "../commands/add.js";
import { filterTasks } from "../commands/filter.js";
import { insertTodo } from "../commands/insert.js";
import { markTodos } from "../commands/mark.js";
import { removeTodos } from "../commands/remove.js";
import { searchTasks } from "../commands/search.js";
import { sortTasks } from "../commands/sort.js";
import { addSubtask } from "../commands/subtask.js";
import { unmarkTodos } from "../commands/unmark.js";
import { updateTodo } from "../commands/update.js";

import { printTasks } from "./display.js";
import { promptForText } from "./prompt.js";

export interface ChainStep {
    type: "search" | "filter" | "sort" | "remove" | "mark" | "unmark" | "update" | "subtask" | "add" | "insert";
    args?: string[];
}

export async function executeChain(todoFile: string, steps: ChainStep[]): Promise<void> {
    const todo = new TodoTxt({ filePath: todoFile });
    await todo.load();

    let allTasks = todo.list();
    let indices: number[] | null = null;

    const querySteps: ChainStep[] = [];
    let actionStep: ChainStep | null = null;

    for (const step of steps) {
        if (["search", "filter", "sort"].includes(step.type)) {
            querySteps.push(step);
        } else {
            actionStep = step;
            break;
        }
    }

    for (const step of querySteps) {
        if (step.type === "search") {
            const text = step.args?.[0];
            if (!text) {
                throw new Error("Search requires a text argument");
            }
            const currentTasks: Task[] = indices ? indices.map((i) => allTasks[i - 1]) : allTasks;
            const filteredIndices = searchTasks(currentTasks, text);
            indices = filteredIndices.map((i) => {
                const taskInCurrent: Task = currentTasks[i - 1];
                return allTasks.findIndex((t) => t === taskInCurrent) + 1;
            });
        } else if (step.type === "filter") {
            const arg = step.args?.[0];
            if (!arg) {
                throw new Error("Filter requires an argument");
            }
            const currentTasks: Task[] = indices ? indices.map((i) => allTasks[i - 1]) : allTasks;
            let filteredIndices: number[];
            if (arg.includes(":")) {
                const [key, value] = arg.split(":");
                filteredIndices = filterTasks(currentTasks, key, value);
            } else {
                filteredIndices = filterTasks(currentTasks, arg);
            }
            indices = filteredIndices.map((i) => {
                const taskInCurrent: Task = currentTasks[i - 1];
                return allTasks.findIndex((t) => t === taskInCurrent) + 1;
            });
        } else if (step.type === "sort") {
            const arg = step.args?.[0];
            if (!arg) {
                throw new Error("Sort requires an argument");
            }
            const currentTasks: Task[] = indices ? indices.map((i) => allTasks[i - 1]) : allTasks;
            const parts = arg.split(":");
            const key = parts[0];
            const order = parts.length > 1 ? (parts[1].toUpperCase() as "ASC" | "DESC") : "ASC";
            const sortedIndices = sortTasks(currentTasks, key, order);
            indices = sortedIndices.map((i) => {
                const taskInCurrent: Task = currentTasks[i - 1];
                return allTasks.findIndex((t) => t === taskInCurrent) + 1;
            });
        }
    }

    if (!actionStep) {
        const displayIndices = indices || allTasks.map((_, i) => i + 1);
        const filtered = displayIndices.map((i) => allTasks[i - 1]);
        printTasks(filtered, displayIndices);
        return;
    }

    if (!indices || indices.length === 0) {
        indices = allTasks.map((_, i) => i + 1);
    }

    if (actionStep.type === "remove") {
        await removeTodos(todoFile, indices);
        console.log("Todos removed successfully");
    } else if (actionStep.type === "mark") {
        await markTodos(todoFile, indices);
        console.log("Todos marked as complete");
    } else if (actionStep.type === "unmark") {
        await unmarkTodos(todoFile, indices);
        console.log("Todos marked as incomplete");
    } else if (actionStep.type === "update") {
        let newText = actionStep.args?.[0];
        if (!newText) {
            newText = await promptForText("Enter new text:");
        }
        const firstIndex = indices[0];
        if (firstIndex) {
            await updateTodo(todoFile, firstIndex, newText);
            console.log("Todo updated successfully");
        }
    } else if (actionStep.type === "subtask") {
        let subtaskText = actionStep.args?.[0];
        if (!subtaskText) {
            subtaskText = await promptForText("Enter subtask text:");
        }
        const firstIndex = indices[0];
        if (firstIndex) {
            await addSubtask(todoFile, firstIndex, subtaskText);
            console.log("Subtask added successfully");
        }
    } else if (actionStep.type === "add") {
        let text = actionStep.args?.[0];
        if (!text) {
            text = await promptForText("Enter todo text:");
        }
        const firstIndex = indices[0];
        await addTodo(todoFile, text, firstIndex ?? null);
        console.log("Todo added successfully");
    } else if (actionStep.type === "insert") {
        let text = actionStep.args?.[0];
        if (!text) {
            text = await promptForText("Enter todo text:");
        }
        const firstIndex = indices[0];
        if (firstIndex) {
            await insertTodo(todoFile, firstIndex, text);
            console.log("Todo inserted successfully");
        }
    }
}
