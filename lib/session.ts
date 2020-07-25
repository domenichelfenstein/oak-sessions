import { Context, RouterContext, CookiesSetDeleteOptions } from "https://deno.land/x/oak/mod.ts";
import { v4 } from "https://deno.land/std/uuid/mod.ts";
import { InMemorySessionRepository } from "./inMemorySessionRepository.ts";
import { ISessionRepository } from "./interfaces.ts";

const SESSION_ID = "seesionId";

export class Session<T> {
    private tempKey: string | undefined;

    constructor(
        private initState: () => T,
        private cookieOptions: CookiesSetDeleteOptions = {},
        private repo: ISessionRepository<T> = new InMemorySessionRepository<T>()) {}

    public sessionHandling = async (context: Context, next: () => Promise<void>) => {
        if (context.cookies.get(SESSION_ID) == undefined) {
            const initialState = this.initState();
            const uuid = v4.generate();
            await this.repo.set(uuid, initialState);
            context.cookies.set(SESSION_ID, uuid, this.cookieOptions);
            this.tempKey = uuid;
        }
        await next();
    };

    public getState = async (context: RouterContext): Promise<T> => {
        const sessionId = await this.getKey(context);
        const state = await this.repo.get(sessionId);
        if(state) {
            return state;
        } else {
            const newState = this.initState();
            await this.repo.set(sessionId, newState);
            return newState;
        }
    };

    public storeState = async (context: RouterContext, state: T) => {
        const sessionId = await this.getKey(context);
        await this.repo.set(sessionId, state);
    };

    private getKey = (context: RouterContext) => {
        const sessionIdFromCookies = context.cookies.get(SESSION_ID);
        const sessionId = sessionIdFromCookies ?? this.tempKey;
        return new Promise<string>((resolve, reject) => {
            if(sessionId) {
                resolve(sessionId);
            } else {
                reject();
            }
        });
    }
}
