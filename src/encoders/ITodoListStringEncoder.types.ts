import { ITodoDoc } from '../indexer.types';

export interface ITodoListStringEncoder {
    encode(data: ITodoDoc[]): string;
    decode(data: string): ITodoDoc[];
}

export interface IStringEncoder {
    encode(data: string): string;
    decode(data: string): string;
}
