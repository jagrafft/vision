/*jslint es6 */
import Chance from "chance";
import moment from "moment";

import Status from "../../js/status";
import stems from "./stems.json";

const chance = new Chance();

// TODO if `valid = false` call `corruptObect`
/**
 * Mock a vision `Session` object
 * @param valid Return a valid packet
 * @returns Promise<Object>
 */
export const mockSession = (valid = true) => {
    const m = moment();
    const label = chance.n(chance.word, chance.d6()).join(" ");

    return Promise.resolve(
        new Object({
            dt: m.format("X"),
            deviceIds: chance.n(chance.hash, chance.d8(), {length: 16}),
            label: label,
            location: chance.country({full: true}),
            path: `mock/session/path/${label.replace(/\s/g, "_")}-${m.format("YYYY-MM-DD_HHmmss")}`,
            tags: chance.coin() ? chance.pickset(stems.tags, chance.natural({min: 1, max: 6})) : [],
            status: chance.pickone(Object.values(Status)),
            lastUpdate: m.add(chance.minute(), "minutes").add(chance.second(), "seconds").format("X")
        })
    );
};

Promise.all(chance.n(mockSession, 10, true)).then((x) => console.log(x.length));