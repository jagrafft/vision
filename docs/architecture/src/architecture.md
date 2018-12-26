---
title: vision Dataservice Architecture
author: Jason A. Grafft
bibliography: './architecture/src/bib/references.bib'
csl: './architecture/src/bib/chicago-fullnote-bibliography.csl'
---
# *vision* Service Architecture

## Data Structures
### Device
- Cortex
    - NeDB
- Monocle
```json
{
    "mime": {"type": "Array<String>", "optional": false},
    "label": {"type": "String", "optional": false},
    "location": {"type": "String", "optional": false},
    "address": {"type": "String", "optional": false},
    "port": {"type": "Number", "optional": true},
    "...{profile}": {"type": "Object", "optional": true}
}
```

- Multiple *profile* tags may be defined, each with a unique name. Some are recognized as keywords by core *vision* microservices (see below).

#### *profile*
```json
{
    "mime": {"type": "String", "optional": false},
    "protocol": {"type": "String", "optional": true},
    "port": {"type": "Number", "optional": true},
    "path": {"type": "String", "optional": true},
    "user": {"type": "String", "optional": true},
    "password": {"type": "String", "optional": true}
}
```

| profile | description |
|:-:|---|
| record | Used by default *vision* handlers for data written to disk. |
| stream | Used by *Monocle* for accessing live views. |

### Handler
- Cortex
    - NeDB
```json
{
    "default": {"type": "Boolean", "optional": false},
    "mime": {"type": "Array<String>", "optional": false},
    "encoder": {"type": "Object", "optional": false},
    "...{mime/type}": {"type": "Object", "optional": false}
}
```

#### *encoder*, *mime/type* `Object`s
- *encoder* `Object` defines encoder settings. It may represent any key-value pairs required by the handler.
- A *mime/type* `Object` is required for each type in the *mime* array. It defines datatype-specific settings for handlers.


### Log
- Cortex
    - NeDB-Logger
```json
{
    "dt": {"type": "Date", "optional": false},
    "caller": {"type": "String", "optional": false},
    "event": {"type": "String", "optional": false},
    "report": {"type": "String", "optional": false}
}
```

### Packet
- *vision*
```json
{
    "key": {"type": "String", "optional": false},
    "val": {"type": "String", "optional": false},
    "sender": {"type": "String", "optional": false},
    "status": {"type": "String", "optional": true}
}
```

### Session
- Cortex
    - NeDB-Logger
- Relay
```json
{
    "dt": {"type": "Date", "optional": false},
    "deviceIds": {"type": "Array<String>", "optional": false},
    "label": {"type": "String", "optional": false},
    "location": {"type": "String", "optional": false},
    "path": {"type": "String", "optional": false},
    "tags": {"type": "String", "optional": false},
    "status": {"type": "String", "optional": false},
    "lastUpdate": {"type": "Date", "optional": false}
}
```

## References
