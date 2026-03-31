import type { Task } from "txtodo";

export interface PrintTasksOptions {
    highlightText?: string;
}

export function printTasks(tasks: Task[], originalIndices: number[], options?: PrintTasksOptions): void {
    const { highlightText } = options || {};

    tasks.forEach((task, idx) => {
        const lineNum = originalIndices[idx];
        const completed = task.completed ? "x" : " ";
        const priority = task.priority ? `(${task.priority})` : "   ";

        let indent = "";
        if (task.indentLevel && task.indentLevel > 0) {
            const indentSpaces = " ".repeat(task.indentLevel - 4);
            indent = indentSpaces + "└─ ";
        }

        let text = task.description;

        if (highlightText) {
            text = text.replace(new RegExp(highlightText, "gi"), (match) => `\x1b[1m${match}\x1b[0m`);
        }

        console.log(`${lineNum}. [${completed}] ${priority} ${indent}${text}`);
    });
}
