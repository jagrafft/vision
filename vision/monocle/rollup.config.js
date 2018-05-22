/*jslint es6 */
import buble from "rollup-plugin-buble";
import commonjs from "rollup-plugin-commonjs";
import dotenv from "dotenv";
import nodeResolve from "rollup-plugin-node-resolve";
import path from "path";
import { uglify } from "rollup-plugin-uglify";

dotenv.config();

export default {
    input: path.join(__dirname, "src/monocle.js"),
    output: {
        format: "iife",
        file: path.join(__dirname, "dist/bundle.min.js"),
        sourcemap: process.env.NODE_ENV === "development"
    },
    plugins: [
        nodeResolve({
            browser: true,
            jsnext: true,
            preferBuiltins: false
        }),
        commonjs({
            namedExports: {
                "node_modules/xstream/index.js": ["xs"]
            }
        }),
        buble(),
        uglify()
    ]
}