import tape from "blue-tape";

import Status from "../js/status";
import * as Packet from "../js/packet";

/**
 * Packet.packet(...)
 */
tape("check packet(...VALID)", () => {
    return Promise.all([
        Packet.packet("A", "a", "Beaumont", Status.OK),
        Packet.packet("B", "b", "Mr. Cat", Status.SUCCESS),
        Packet.packet("C", "c", "Anonymous", Status.ERROR),
        Packet.packet("X", "x", "The Dodo")
    ]);
});

tape("check packet(...INVALID)", (test) => {
    return test.shouldFail(
        Promise.all([
            Packet.packet("Y", "y"),
            Packet.packet("Z")
        ]),
        Status.ERROR
    );
});

/**
 * Packet.prune(...)
 */

/**
 * Packet.session(...)
 */
