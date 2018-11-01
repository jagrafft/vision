# *vision* microservices

| microservice | description | development status |
|---|---|:-:|
| [Cortex](cortex) | Process manager for *vision* nodes | active |
| [Monocle](monocle) | Client interface for Cortex data node | active |
| [Neurons](neurons) | Data structures and functions used by *vision* microservices | next phase |
| [Relay](relay) | Kodi Addon for HLS playback | next phase |
| [Retina](retina) | Expansion of Monocle able to interact with mutliple Cortex nodes | under review |

<!-- ## Microservices Communication Specifications
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
``` -->

[cortex]: https://github.com/jagrafft/vision/tree/master/vision/cortex/
[monocle]: https://github.com/jagrafft/vision/tree/master/vision/monocle/
[neurons]: https://github.com/jagrafft/vision/tree/master/vision/neurons/
[relay]: https://github.com/jagrafft/vision/tree/master/vision/relay/
[retina]: https://github.com/jagrafft/vision/tree/master/vision/retina/