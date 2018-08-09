---
author: Jason A. Grafft
description:
files: ./journal
---
## *vision*
- [ ] Define standard error code library in Ray

## Cortex
- [c] Identify standard error code library (not needed) *2018-08-09*
- [ ] Create SIMPLE error code library if overblown or unsuitable
- [ ] Create PM2 test process (counter)
- [ ] Define process for PM2 status reports
    - I still think Cortex should push these; my assumption, for the moment, is that there won't be many ways to avoid slamming PM2 with connection requests.
    - Perhaps require a subscription request? So instead of looping through `WSS.Clients` use a method to add/remove clients from a list on request.
- [ ] Start scripts individually\*
- [ ] Stop scripts individually\*
- [ ] Starts process groups\*
- [ ] Stops process groups\*
- [-] \* In Cortex, a `group == [individual].length > 1`. Thus, individual processes are not aware of their membership status--grouping is performed "cosmetically" for user convenience.
- [x] Returns list of devices *2018-08-06*
- [ ] Returns list of recordings
- [ ] Allows naming/renaming of process groups (files [time]-[device].[ext])
- [x] Allows DB find *2018-08-09*
- [ ] Allows DB update
- [ ] Allows DB insert
- [ ] Allows DB remove
- [ ] Writes updates to DB on behalf of managed recording processes
- [ ] Pushes operational information to log
- [ ] Request-based subscription service for process status pushes
- [ ] NGINX service configured for streaming content
- [x] Abstract "vision specification" tagged items into global library
- [ ] Use UUID function to generate default names

## Data Exchange Specifications
- [ ] Define `record` NeDB object
- [x] Define `request` packet *2018-08-06*
- [x] Define `response` packet *2018-08-06*
- [x] Define `device` NeDB object *2018-08-06*
- [ ] Identify elements allowed to go "over the wire"
- [ ] Define `val` object for `"find"` requests
- [ ] Define `val` object for `"insert"` requests
- [ ] Define `val` object for `"remove"` requests
- [ ] Define `val` object for `"start"` requests
- [ ] Define `val` object for `"status"` requests
- [ ] Define `val` object for `"stop"` requests
- [ ] Define `val` object for `"update"` requests
- [x] Define `val` object for `"_"` requests *2018-08-06*