import { ITodoListStringEncoder } from ".";
import { ITodoDoc } from "../indexer.types";

export class JsonEncoder implements ITodoListStringEncoder {
    encode(data: ITodoDoc[]): string {
        return JSON.stringify(data);
    }

    decode(data: string): ITodoDoc[] {
        return JSON.parse(data);
    }
}
