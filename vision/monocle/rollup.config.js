/*jslint es6 */
import json from "rollup-plugin-json";
import babel from "rollup-plugin-babel";
import npm from "rollup-plugin-npm";

export default {
    entry: "src/monocle.js",
    format: "iife",
    plugins: [
        json(),
        babel({
            exclude: "node_modules/**"
        }),
        npm({
            jsnext: true,
            main: true,
            browser: true
        })
    ],
    dest: "dist/bundle.js"
}