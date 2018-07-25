/*jslint es6*/
import Datastore from "nedb";

import settings from "../resources/settings.json";
import devices from "../resources/simportal-devices.json";

const db = new Datastore({filename: `${settings.defaults.db}/cortex.db`, autoload: true});

devices.forEach((e) => {
    db.findOne({address: e.address, dataType: e.dataType, label: e.label}, (err, res) => {
        if (err) console.error(err);
        if (res != null) {
            console.log(res);
        } else {
            db.insert(e, (err, res) => {
                if (err) console.log(error);
                console.log(`${e.label} inserted!`)
            });
        }
    });
});