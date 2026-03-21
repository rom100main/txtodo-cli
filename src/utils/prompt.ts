import * as clack from "@clack/prompts";

export async function promptForText(message: string, placeholder?: string): Promise<string> {
    const result = await clack.text({
        message,
        placeholder: placeholder || "Enter text...",
    });

    if (clack.isCancel(result)) {
        throw new Error("Operation cancelled");
    }

    return result;
}

export function logError(message: string): void {
    console.error(`Error: ${message}`);
}
