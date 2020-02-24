import { ITodoDoc } from "../indexer.types";

export interface ITodoListStringEncoder {
    encode(data: ITodoDoc[]): string;
    decode(data: string): ITodoDoc[];
}
