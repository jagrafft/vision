/*jslint es6*/
/**
 * xstream listener that prints input to console
 * @const {xs<Listener>}
 */
const StreamPrinter = {
    next: (v) => console.log(v),
    error: (e) => console.error(e),
    complete: () => console.log("StreamPrinter complete")
};