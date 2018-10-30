import mkdirp from "mkdirp";
import Task from "folktale/concurrency/task";

import "../../neurons/group";
import {logEvent} from "./logger";
import settings from "./resources/settings.json";
import { S_IFREG } from "constants";

/**
 * Create `path` with mkdir -p method
 * @param {String} path 
 * @returns {Folktale<Task>}
 */
export const createDir = (path) => {
    return Task.task(
        (resolver) => {
            resolver.cleanup(() => {
                logEvent(path, "createDir", "CLEANUP").run();
            });

            resolver.onCancelled(() => {
                logEvent(path, "createDir", "CANCELLED").run();
            });

            mkdirp(path, (err, res) => {
                // TODO Reduce number of return states (err, EXISTS, OK)
                if (err) resolver.reject(err);
                res === null ? resolver.reject("EXISTS") : resolver.resolve("OK");
            });
        }
    );
};

/**
 * Combine device information and parameters for record handler
 * @param {Array<Object>} devs Objects representing devices
 * @returns {Array<Object>}
 */
export const deviceParams = (devs) => {
    return devs.map((dev) => {
        const params = dev.handlers[0] in settings.handlers ? settings.handlers[dev.handlers[0]] : settings.defaults[x.dataType];
        const pair = "avSrcPair" in params ? params.avSrcPair : false;

        return new Object({
            avSrcPair: pair,
            dataType: dev.dataType,
            device: dev,
            params: params
        })
    });
};

/**
 * Pair audio and video devices by shared key
 * @param {Array<Object>} devs Audio and video devices for pairing; `Object`s are `deviceParams` return values
 * @param {String} by 
 * @returns {Array<Object>}
 */
export const pairAvDevices = (devs, by = "location") => {
    const g = devs.groupByKey("dataType");
    // if ("audio" in g && "video" in g) {
        // return g.audio.map((a) => {
            // const v = g.video.filter((x) => x[by] === a[by]);
            // if (v.length > 0) {
            //     a.map((v) => {
            //         return new Object({
            //             devices: {
            //                 audio: a.device,
            //                 video: v.device
            //             },
            //             params: {
            //                 audio: a.params,
            //                 video: v.params
            //             }
            //         })
            //     });
            // } else {
            //     return
            // }
        // });
    // } else {
        // return devs;
    // }
};