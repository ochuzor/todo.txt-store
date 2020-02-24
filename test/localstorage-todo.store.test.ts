import { LocalStorageTodoStore } from '../src/localstorage-todo.store';
import { ITodoDoc } from '../src/indexer.types';
// import { ITodoListStringEncoder } from '../src/encoders/ITodoListStringEncoder.types';

describe('LocalStorageTodoStore', () => {
    const fakeKey = 'fake-key';
    let mockStorage: any;
    let encoder: any;

    beforeEach(() => {
        encoder = {
            encoding: jest.fn(),
            decode: jest.fn(),
        };

        mockStorage = {
            setItem: jest.fn(),
            getItem: jest.fn(),
        };
    });

    describe('writeData', () => {
        let sut: LocalStorageTodoStore;
        let fakeData: ITodoDoc[];
        const fakeEncoded = 'fake-encoded-data';

        beforeEach(() => {
            fakeData = [];
            encoder.encode = jest.fn().mockReturnValue(fakeEncoded);
            sut = new LocalStorageTodoStore(fakeKey, mockStorage, encoder);
            sut.writeData(fakeData);
        });

        it('should call storage setItem', () => {
            expect(mockStorage.setItem).toHaveBeenCalledWith(
                fakeKey,
                fakeEncoded
            );
        });

        it('should call encoder.encode', () => {
            expect(encoder.encode).toHaveBeenCalledWith(fakeData);
        });
    });

    describe('readData', () => {
        describe('called with an empty data string', () => {
            let result: ITodoDoc[];
            let sut: LocalStorageTodoStore;

            beforeEach(() => {
                mockStorage.getItem.mockReturnValue('');
                sut = new LocalStorageTodoStore(fakeKey, mockStorage, encoder);
                result = sut.readData();
            });

            it('should call store getItem', () => {
                expect(mockStorage.getItem).toHaveBeenCalledWith(fakeKey);
            });

            it('...and it should return an empty array', () => {
                expect(result).toEqual([]);
            });
        });

        describe('called with a non-empty data string', () => {
            const fakeItemVal = 'fake-item-valu';
            const fakeDecodedValue: ITodoDoc[] = [{id: 1, text: 'x run some tests'}];
            let result: ITodoDoc[];
            let sut: LocalStorageTodoStore;

            beforeEach(() => {
                mockStorage.getItem.mockReturnValue(fakeItemVal);
                encoder.decode = jest.fn().mockReturnValue(fakeDecodedValue);
                sut = new LocalStorageTodoStore(fakeKey, mockStorage, encoder);
                result = sut.readData();
            });

            it('should call encoder.decode', () => {
                expect(encoder.decode).toHaveBeenCalledWith(fakeItemVal);
            });

            it('...and return its return value', () => {
                expect(result).toMatchObject(fakeDecodedValue);
            });
        });

        describe('if the data is not array', () => {
            it('should throw an invalid data error', () => {
                const Sut = new LocalStorageTodoStore('fakeKey', {
                    getItem: () => 'some long string',
                    setItem: jest.fn(),
                }, {
                    encode: jest.fn(),
                    decode: jest.fn().mockReturnValue('not an array'),
                });
                expect(() => Sut.readData()).toThrowError(/^Invalid Data$/);
            });
        });
    });

    describe('export()', () => {
        let sut: LocalStorageTodoStore;
        const data = [
            { id: 1, text: 'some texts' },
            { id: 2, text: 'other texts' },
        ];
        const mockExporter = {
            export: jest.fn(),
        };

        beforeEach(() => {
            sut = new LocalStorageTodoStore(fakeKey, mockStorage);
            sut.readData = jest.fn().mockReturnValue(data);
            sut.export(mockExporter);
        });

        it('should call exporter.export()', () => {
            expect(mockExporter.export).toBeCalledWith(data);
        });
    });
});
