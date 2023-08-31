export interface Roles {
    name: string,
    isDefault: boolean,
    isStatic: boolean,
    isPublic: boolean,
    concurrencyStamp: string,
    id: string,
    extraProperties: object
}

export interface ListResult<T> {
    items: T[];
}
export type RolesList = ListResult<Roles>;