export type IdType = number | string;

export interface ITodoDoc {
    id: IdType;
    text: string;
}

export interface ITodoIndexer {
    addDoc(doc: ITodoDoc): void;
    getDoc(id: IdType): ITodoDoc;
    deleteDoc(id: IdType): void;
    getAll(): ITodoDoc[];
    search(query: string): ITodoDoc[];
}
