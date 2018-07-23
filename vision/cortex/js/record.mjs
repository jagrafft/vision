/*jslint es6*/

export default {
    start(req) {
        console.log(`record.start = (req) ${req}`);
    },
    stop(req) {
        console.log(`record.stop = (req) ${req}`);
    }
}