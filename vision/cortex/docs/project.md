---
author: Jason A. Grafft
description:
files: ./journal
---
## ToDo
- [x] Define `switch :: String -> Folktale<Result>` *2018-08-09*
- [x] Resolve bug caused by using `Task.run()` at end of `switch` statement *2018-08-09*
- [ ] Define way for PM2 status updates to push into an `XStream`
- [ ] Abstract `ws.send(...)` to match statemenet following `vetmsg` call (~line 64 of `cortex.mjs`)
- [ ] Add UUID function
- [ ] Define `val` object for `"find"` request
- [ ] Define chain of functions which produce `Error || Result` for `"find"`
- [ ] Define `val` object for `"start"` request
- [ ] Define chain of functions which produce `Error || Result` for `"start"`
- [ ] Define `val` object for `"status"` request
- [ ] Define chain of functions which produce `Error || Result` for `"status"`
- [ ] Define `val` object for `"stop"` request
- [ ] Define chain of functions which produce `Error || Result` for `"stop"`
- [ ] Define chain of functions which produce `Error || Result` for `"_"`
- [ ] `"start"` works for a single process
- [ ] `"start"` works for a multiple processes
- [ ] `"stop"` works for a single process
- [ ] `"stop"` works for a multiple processes
- [ ] `record` NeDB object defined