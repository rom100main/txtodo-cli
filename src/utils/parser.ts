export function parseListIndices(input: string): number[] | "all" {
    if (input.toLowerCase() === "all") {
        return "all";
    }

    const parts = input.split(",").map((s) => s.trim());
    const indices: number[] = [];

    for (const part of parts) {
        const num = parseInt(part, 10);
        if (isNaN(num) || num < 1) {
            throw new Error(`Invalid index: ${part}`);
        }
        indices.push(num);
    }

    return indices;
}

export function getFirstIndex(indices: number[] | "all"): number | null {
    if (indices === "all") {
        return null;
    }
    return indices.length > 0 ? indices[0] : null;
}
