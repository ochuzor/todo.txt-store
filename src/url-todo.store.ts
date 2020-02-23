import { ITodoDoc } from './indexer.types';
import {
    ITodoStore,
    ITodoDataExporter,
    IWindowLocationObject,
} from './store.types';

// https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding
function b64EncodeUnicode(str: string) {
    // first we use encodeURIComponent to get percent-encoded UTF-8,
    // then we convert the percent encodings into raw bytes which
    // can be fed into btoa.
    return btoa(
        encodeURIComponent(str).replace(
            /%([0-9A-F]{2})/g,
            function toSolidBytes(_match, p1) {
                return String.fromCharCode(parseInt(p1, 16));
            }
        )
    );
}
// b64EncodeUnicode('✓ à la mode'); // "4pyTIMOgIGxhIG1vZGU="
// b64EncodeUnicode('\n'); // "Cg=="

function b64DecodeUnicode(str: string) {
    // Going backwards: from bytestream, to percent-encoding, to original string.
    return decodeURIComponent(
        atob(str)
            .split('')
            .map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join('')
    );
}
// b64DecodeUnicode('4pyTIMOgIGxhIG1vZGU='); // "✓ à la mode"
// b64DecodeUnicode('Cg=='); // "\n"

export class UrlTodoStore implements ITodoStore {
    constructor(
        private locationObject: IWindowLocationObject = window.location
    ) {}

    writeData(data: ITodoDoc[]): void {
        const json = JSON.stringify(data);
        const encoded = b64EncodeUnicode(json);
        this.locationObject.hash = encoded;
    }

    readData(): ITodoDoc[] {
        const hash = this.locationObject.hash || '';
        const json = b64DecodeUnicode(hash.replace('#', ''));
        const data = JSON.parse(json);
        if (!Array.isArray(data)) throw new Error('Invalid Data');

        return data;
    }

    export(exporter: ITodoDataExporter): void {
        exporter.export(this.readData());
    }
}
