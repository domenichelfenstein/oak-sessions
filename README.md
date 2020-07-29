# oak Sessions

A simple session middleware for [oak](https://github.com/oakserver/oak).

## How to use it?
```ts
import { Application } from "https://deno.land/x/oak/mod.ts";
import { Session } from "../mod.ts";

// 1. create session object and specify how a new session gets initialized
const session = new Session(() => ({ counter: 1 }));

const app = new Application();
// 2. tell your oak application to use the session middleware
app.use(session.sessionHandling);

app.use(async (context) => {
    // 3. read and manipulate the session state of a user
    context.response.body = `Counter: ${context.state.session.counter++}`;
});
await app.listen({ port: 8000 });
```
* this code is simplified and will not work perfectly
(your browser usually performs Favicon requests, leading to a +2 increase
every time you hit the F5 button). Use the example, or even better use Routers
to handle your requests.