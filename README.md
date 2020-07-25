# oak Sessions

A simple session handler for [oak](https://github.com/oakserver/oak).

## How to use it?
```ts
import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { Session } from "https://github.com/domenichelfenstein/oak-sessions/mod.ts";

// 1. create session object and specify how new session get initialized
const session = new Session(() => ({ counter: 1 }));
const router = new Router()
    .get("/", async (context) => {
        // 2. read the session state of a user
        const state = await session.getState(context);
        context.response.type = "text/html";
        context.response.body = `Counter: ${state.counter}`;

        // 3. store the session state
        await session.storeState(context, { counter: state.counter + 1});
    })

const app = new Application();
// 4. tell your oak application to use the session handling
app.use(session.sessionHandling);
app.use(router.routes());
await app.listen({ port: 8000 });
```