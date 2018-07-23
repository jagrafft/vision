/*jslint es6*/
"use strict";
import Datastore from "nedb";
import path from "path";

import settings from "../resources/settings.json";
import sources from "./simportal-sources.json";

const db = new Datastore({filename: `${settings.defaults.db}/cortex-ne.db`, autoload: true});

sources.forEach(e => {
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