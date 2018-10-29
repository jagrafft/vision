import mkdirp from "mkdirp";
import Task from "folktale/concurrency/task";

import {logEvent} from "./logger";

export const createDir = (dir) => {
    return Task.task(
        (resolver) => {
            resolver.cleanup(() => {
                logEvent(dir, "createDir", "CLEANUP").run();
            });

            resolver.onCancelled(() => {
                logEvent(dir, "createDir", "CANCELLED").run();
            });

            mkdirp(dir, (err, p) => {
                // TODO Reduce number of return states (err, EXISTS, OK)
                if (err) resolver.reject(err);
                p === null ? resolver.reject("EXISTS") : resolver.resolve("OK");
            });
        }
    );
};