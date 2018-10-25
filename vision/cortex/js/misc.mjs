import {logEvent} from "./logger";
import mkdirp from "mkdirp";
import Task from "folktale/concurrency/task";

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
                // TODO Fix error returns
                if (err) resolver.reject(err);
                p === null ? resolver.reject("EXISTS") : resolver.resolve("OK");
            });
        }
    );
};