import { IStringEncoder } from './ITodoListStringEncoder.types';
export class NoOpStringEncoder implements IStringEncoder {
    encode(data: string): string {
        return data;
    }
    decode(data: string): string {
        return data;
    }
}
