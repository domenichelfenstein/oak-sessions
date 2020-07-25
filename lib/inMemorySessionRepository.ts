import { ISessionRepository } from "./interfaces.ts";

export class InMemorySessionRepository<T> implements ISessionRepository<T> {
    private repo: { [key: string]: T | undefined } = {};

    public async get(key: string): Promise<T | undefined> {
        return this.repo[key];
    }
    public async set(key: string, value: T): Promise<void> {
        this.repo[key] = value;
    }
}
