import tape from "blue-tape";

import Status from "../js/status";

const expected = new Object({ERROR: "ERROR", OK: "OK", SUCCESS: "OK"});

tape("check Status return values", (test) => {
    const vals = Object.entries(expected);
    test.plan(vals.length);
    vals.forEach((x) => {
        test.equal(Status[x[0]], x[1]);
    });
});