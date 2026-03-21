import fs from "fs";
import path from "path";

export function resolveTodoFile(filePath?: string): string {
    if (filePath) {
        const resolved = path.resolve(filePath);
        if (!fs.existsSync(resolved)) {
            fs.writeFileSync(resolved, "", "utf-8");
        }
        return resolved;
    }

    const defaultPath = path.resolve("todo.txt");
    if (!fs.existsSync(defaultPath)) {
        fs.writeFileSync(defaultPath, "", "utf-8");
    }
    return defaultPath;
}

export function ensureDirectory(dirPath: string): void {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}
