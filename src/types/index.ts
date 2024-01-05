export type RestDictionary<T = number | string |  boolean> = {
    label: string;
    value: T;
}

export type ListType<T> = {
    count: number;
    data: T[]
}

export type ListParams = {
    page: number;
    count: number
}