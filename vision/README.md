# vision
Root directory for *vision* microservices.

- [Cortex](cortex) - Data node
- [Mirror](mirror) - Kodi Addon
- [Window](window) - UI for *vision*, based on Riot.js
- [Monocle](monocle) - UI for Cortex, based on Cycle.js
- [Retina](retina) - Gateway service

## Microservices Communication Specifications
*vision* microservices communicate via JSON packets whose key-value pairs conform to the [*vision* data exchange format](#).

```json
// Request packet
{
    "req": "{string}",
    "val": "{Object}"
}

// Response packet
{
    "req": "{string}",
    "res": "{Object}",
    "status": "{string}"
}
```

[cortex]: https://github.com/jagrafft/vision/tree/master/vision/cortex
[mirror]: https://github.com/jagrafft/vision/tree/master/vision/mirror/
[window]: https://github.com/jagrafft/vision/tree/master/vision/window/
[monocle]: https://github.com/jagrafft/vision/tree/master/vision/monocle/
[retina]: https://github.com/jagrafft/vision/tree/master/vision/retina/