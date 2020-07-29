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
        let sessionId: string;
        const cookieSessionId = context.cookies.get(SESSION_ID);
        if (cookieSessionId == undefined) {
            const initialState = this.initState();
            sessionId = v4.generate();
            await this.repo.set(sessionId, initialState);
            context.cookies.set(SESSION_ID, sessionId, this.cookieOptions);
            context.state.session = initialState;
        } else {
            sessionId = cookieSessionId;
            context.state.session = await this.repo.get(sessionId)
                .catch(async _ => {
                    const initialState = this.initState();
                    await this.repo.set(sessionId, initialState);
                    return initialState;
                });
        }

        await next();
        await this.repo.set(sessionId, context.state.session);
    };
}
