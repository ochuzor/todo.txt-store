import {LocalStorageTodoStore} from '../src/localstorage-todo.store';
import { ITodoDoc } from '../src/indexer.types';

describe('LocalStorageTodoStore', () => {
    const fakeKey = 'fake-key';
    let mockStorage: any;

    beforeEach(() => {
        mockStorage = {
            setItem: jest.fn(),
            getItem: jest.fn(),
        };
    });

    describe('writeData', () => {
        it('should call storage setItem', () => {
            const fakeData: ITodoDoc[] = [];
            const sut = new LocalStorageTodoStore(fakeKey, mockStorage);
            sut.writeData(fakeData);
            expect(mockStorage.setItem)
                .toHaveBeenCalledWith(fakeKey, JSON.stringify(fakeData));
        });
    });

    describe('readData', () => {
        describe('called with an empty data string', () => {
            let result: ITodoDoc[];
            let sut: LocalStorageTodoStore;
            beforeEach(() => {
                mockStorage.getItem.mockReturnValue("");
                sut = new LocalStorageTodoStore(fakeKey, mockStorage);
                result = sut.readData();
            })

            it('should call store getItem', () => {
                expect(mockStorage.getItem).toHaveBeenCalledWith(fakeKey);
            });

            it('...and it should return an empty array', () => {
                expect(result).toEqual([]);
            })
        });

        describe('called with invalid JSON string', () => {
            it('should throw an error', () => {
                mockStorage.getItem.mockReturnValue("invlaid string");
                const sut = new LocalStorageTodoStore(fakeKey, mockStorage);
                expect(() => sut.readData()).toThrow(SyntaxError);
            });
        });

        describe('called with non-array data', () => {
            it('should throw an error with invalid data error', () => {
                mockStorage.getItem.mockReturnValue("{}");
                const sut = new LocalStorageTodoStore(fakeKey, mockStorage);
                expect(() => sut.readData()).toThrowError(/^Invalid Data$/);
            });
        });

        describe('called with valid EMPTY array of data', () => {
            it('should return an empty array', () => {
                mockStorage.getItem.mockReturnValue("[]");
                const sut = new LocalStorageTodoStore(fakeKey, mockStorage);
                const result = sut.readData();
                expect(result).toEqual([]);
            });
        });

        describe('called with valid array of data', () => {
            let result: ITodoDoc[];
            let sut: LocalStorageTodoStore;
            const data = [{id: 1, text: 'some texts'}, 
                    {id: 2, text: 'other texts'}];
            beforeEach(() => {
                mockStorage.getItem.mockReturnValue(JSON.stringify(data));
                sut = new LocalStorageTodoStore(fakeKey, mockStorage);
                result = sut.readData();
            });

            it('should return an array of data', () => {
                expect(result).toMatchObject(data);
            });

            it('with the correct length', () => {
                expect(result).toHaveLength(data.length);
            });
        });

        describe('export()', () => {
            let sut: LocalStorageTodoStore;
            const data = [{id: 1, text: 'some texts'}, 
                    {id: 2, text: 'other texts'}];
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
});
