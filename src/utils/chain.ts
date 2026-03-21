import { TodoTxt } from "txtodo";

export interface ChainContext {
    todo: TodoTxt;
    indices?: number[] | "all";
    hasFilter: boolean;
    hasSort: boolean;
}

export function createChainContext(todo: TodoTxt): ChainContext {
    return {
        todo,
        hasFilter: false,
        hasSort: false,
    };
}

export function applyIndices(context: ChainContext, indices: number[] | "all"): ChainContext {
    return {
        ...context,
        indices,
    };
}
