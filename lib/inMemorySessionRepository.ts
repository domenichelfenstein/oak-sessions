import { ISessionRepository } from "./interfaces.ts";

export class InMemorySessionRepository<T> implements ISessionRepository<T> {
    private repo: { [key: string]: T | undefined } = {};

    public async get(key: string): Promise<T> {
        const value = this.repo[key];
        if(value != undefined) {
            return value;
        } else {
            throw `no value found for key '${key}'`;
        }
    }
    public async set(key: string, value: T): Promise<void> {
        this.repo[key] = value;
    }
}
