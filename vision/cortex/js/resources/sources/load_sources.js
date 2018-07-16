/*jslint es6*/
"use strict";
const Datastore = require("nedb");
const path = require("path");

const settings = require("../settings.json");
const sources = require("./simportal-sources.json");

const p = path.join(__dirname, "..", "..", "..", settings.defaults.db);
const db = new Datastore({filename: `${p}/cortex-ne.db`, autoload: true});

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