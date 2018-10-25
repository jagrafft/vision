import fs from "fs";
import {logEvent} from "./logger";
import mkdirp from "mkdirp";
import Task from "folktale/concurrency/task";

export const createDir = (dir) => {
    return Task.task(
        (resolver) => {
            if (fs.existsSync(dir)) resolver.reject("EXISTS");
            resolver.cleanup(() => {
                logEvent(dir, "createDir", "CLEANUP");
            });
            resolver.onCancelled(() => {
                logEvent(dir, "createDir", "CANCELLED");
            });
            mkdirp(dir, (err) => {
                err ? resolver.reject(err) : resolver.resolve("OK");
            });
        }
    );
};