import * as clack from "@clack/prompts";

export interface PromptResult {
    text: string;
    cancelled: boolean;
    shiftEnterPressed: boolean;
}

export async function promptForText(message: string, placeholder?: string): Promise<PromptResult> {
    const result = await clack.text({
        message,
        placeholder: placeholder || "Enter text...",
    });

    if (clack.isCancel(result)) {
        return { text: "", cancelled: true, shiftEnterPressed: false };
    }

    return { text: result, cancelled: false, shiftEnterPressed: false };
}

export function logError(message: string): void {
    console.error(`Error: ${message}`);
}
