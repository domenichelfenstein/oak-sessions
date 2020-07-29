export interface ISessionRepository<T> {
    get(key: string) : Promise<T>;
    set(key: string, value: T) : Promise<void>;
}