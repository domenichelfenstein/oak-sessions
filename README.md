# oak Sessions

A simple session middleware for [oak](https://github.com/oakserver/oak).

## How to use it?
```ts
import { Application } from "https://deno.land/x/oak/mod.ts";
import { Session } from "https://raw.githubusercontent.com/domenichelfenstein/oak-sessions/master/mod.ts";

// 1. create session object and specify how a new session get initialized
const session = new Session(() => ({ counter: 1 }));

const app = new Application();
// 2. tell your oak application to use the session middleware
app.use(session.sessionHandling);
app.use(async (context) => {
    // 3. read the session state of a user
    const state = await session.getState(context);
    context.response.body = `Counter: ${state.counter}`;
    // 4. store the session state
    await session.storeState(context, { counter: state.counter + 1 });
});
await app.listen({ port: 8000 });
```
