import {TodoDb} from '../src/todo-db';
import { ITodoIndexer, ITodoDoc } from '../src/indexer.types';
import { ITodoStore } from '../src/store.types';

describe('TodoDb', () => {
    let mockIndexer: any;
    let mockStore: any;
    let sut: TodoDb<ITodoIndexer, ITodoStore>;

    beforeEach(() => {
        mockIndexer = {
            addDoc: jest.fn(),
            getDoc: jest.fn(),
            deleteDoc: jest.fn(),
            getAll: jest.fn(),
            search: jest.fn(),
        };

        mockStore = {
            writeData: jest.fn(),
            readData: jest.fn(),
            export: jest.fn(),
        };

        sut = new TodoDb(mockIndexer, mockStore);
    });

    describe('addDoc:', () => {
        const doc = {id: 1, text: 'something'};

        beforeEach(() => {
            sut.writeData = jest.fn();
            sut.getAll = jest.fn().mockReturnValue([]);
            sut.addDoc(doc);
        });

        it('should call _indexer.addDoc', () => {
            expect(mockIndexer.addDoc).toHaveBeenCalledWith(doc);
        });

        it('should call writeData', () => {
            expect(sut.writeData).toBeCalledWith([])
        });

        it('should call getAll', () => {
            expect(sut.getAll).toHaveBeenCalled();
        });
    });

    describe('getDoc:', () => {
        const id = 1001;
        const returnDoc = {id: 1, text: 'hello'};
        let result: any;

        beforeEach(() => {
            mockIndexer.getDoc = jest.fn().mockReturnValue(returnDoc);
            result = sut.getDoc(id);
        });

        it('should call _indexer.getDoc', () => {
            expect(mockIndexer.getDoc).toHaveBeenCalled();
        });

        it('...and return the value from it', () => {
            expect(result).toEqual(returnDoc);
        });
    });

    describe('deleteDoc:', () => {
        const id = 1001;
        beforeEach(() => {
            mockIndexer.deleteDoc = jest.fn();
            sut.writeData = jest.fn();
            sut.getAll = jest.fn().mockReturnValue([]);
            sut.deleteDoc(id);
        });

        it('should call _indexer.deleteDoc', () => {
            expect(mockIndexer.deleteDoc).toHaveBeenCalled();
        });

        it('...and call writeData', () => {
            expect(sut.writeData).toBeCalledWith([])
        });

        it('...and call getAll', () => {
            expect(sut.getAll).toHaveBeenCalled();
        });
    });

    describe('getAll:', () => {
        let result: ITodoDoc[];
        const expectedResult: ITodoDoc[] = [];

        beforeEach(() => {
            mockIndexer.getAll = jest.fn().mockReturnValue(expectedResult);
            result = sut.getAll();
        });

        it('should call _indexer.getAll', () => {
            expect(mockIndexer.getAll).toHaveBeenCalled();
        });

        it('...and return its values', () => {
            expect(result).toMatchObject(expectedResult);
        });
    });

    describe('search:', () => {
        let result: ITodoDoc[];
        const searchString = 'search string';
        const expectedResult: ITodoDoc[] = [];

        beforeEach(() => {
            mockIndexer.search = jest.fn().mockReturnValue(expectedResult);
            result = sut.search(searchString);
        });

        it('should call _indexer.search', () => {
            expect(mockIndexer.search).toHaveBeenCalled();
        });

        it('...and return its values', () => {
            expect(result).toMatchObject(expectedResult);
        });
    });

    describe('writeData:', () => {
        it('should call _store.writeData', () => {
            sut.writeData(new Array<ITodoDoc>());
            expect(mockStore.writeData).toHaveBeenCalled();
        });
    });

    describe('readData:', () => {
        let result: ITodoDoc[];
        const expectedResult: ITodoDoc[] = [];

        beforeEach(() => {
            mockStore.readData = jest.fn().mockReturnValue(expectedResult);
            result = sut.readData();
        });

        it('should call _store.readData', () => {
            expect(mockStore.readData).toHaveBeenCalled();
        });

        it('...and return its values', () => {
            expect(result).toMatchObject(expectedResult);
        });
    });

    describe('export:', () => {
        const data = [
            { id: 1, text: 'some texts' },
            { id: 2, text: 'other texts' },
        ];
        const mockExporter = {
            export: jest.fn(),
        };

        beforeEach(() => {
            sut.readData = jest.fn().mockReturnValue(data);
            sut.export(mockExporter);
        });

        it('should call exporter.export', () => {
            expect(mockExporter.export).toBeCalledWith(data);
        });
    });
});
