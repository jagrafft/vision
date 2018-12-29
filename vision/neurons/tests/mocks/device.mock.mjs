/*jslint es6 */
import Chance from "chance";

import stems from "./stems.json";

const chance = new Chance();

// export const mimeType = () => {};
// {
//     "mime": {"type": "Array<String>", "optional": false},
//     "label": {"type": "String", "optional": false},
//     "location": {"type": "String", "optional": false},
//     "address": {"type": "String", "optional": false},
//     "port": {"type": "Number", "optional": true},
//     "...{profile}": {"type": "Object", "optional": true}
// }

// export const mockDevice = (mimes = [], location == "", valid = true) => {
//     // const _mimes = mimes.length > 0 ? mimes : [chance.pickone(stems.mimes)]
//     const _location = location == "" ? chance.country({full: true}) : location;
//     let obj = new Object({
//         mime: mimes,
//         label: chance.n(chance.word, chance.d6()).join(" "),
//         location: _location,
//         address: chance.ip(),
//         port: chance.natural({min: 4, max: 6})
//     });

//     return Promise.resolve(
        
//     );
// };