import { Context, CookiesSetDeleteOptions } from "https://deno.land/x/oak/mod.ts";
import { v4 } from "https://deno.land/std/uuid/mod.ts";
import { InMemorySessionRepository } from "./inMemorySessionRepository.ts";
import { ISessionRepository } from "./interfaces.ts";

const SESSION_ID = "seesionId";

export class Session<T> {
    constructor(
        private initState: () => T,
        private cookieOptions: CookiesSetDeleteOptions = {},
        private repo: ISessionRepository<T> = new InMemorySessionRepository<T>()) { }

    public sessionHandling = async (context: Context, next: () => Promise<void>) => {
        const sessionIdFromCookie = context.cookies.get(SESSION_ID);
        const sessionId = sessionIdFromCookie == undefined
            ? await this.noSessionCookieAvailable(context)
            : await this.sessionCookieAvailable(context, sessionIdFromCookie);

        await next();

        await this.repo.set(sessionId, context.state.session);
    };

    private noSessionCookieAvailable = async (context: Context) => {
        const initialState = this.initState();
        const sessionId = v4.generate();
        await this.repo.set(sessionId, initialState);
        context.cookies.set(SESSION_ID, sessionId, this.cookieOptions);
        context.state.session = initialState;
        return sessionId;
    }

    private sessionCookieAvailable = async (context: Context, sessionId: string) => {
        context.state.session = await this.repo.get(sessionId)
            .catch(async _ => {
                const initialState = this.initState();
                await this.repo.set(sessionId, initialState);
                return initialState;
            });
        return sessionId;
    }
}
