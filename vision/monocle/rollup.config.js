/*jslint es6*/

import nodeResolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import json from "rollup-plugin-json";
import babel from "rollup-plugin-babel";
import dotenv from "dotenv";

dotenv.config();

export default {
    input: "src/monocle.js",
    sourceMap: process.env.NODE_ENV === "development",
    output: {
        format: "umd",
        file: "dist/bundle.js"
    },
    plugins: [
        json(),
        babel(),
        nodeResolve({ jsnext: true }),
        commonjs()
    ],
    dest: "public/bundle.js"
};

// function cssnext (tagName, css) {
//     css = css.replace(/:scope/g, ":root");
//     css = postcss([postcssCssnext]).process(css).css;
//     css = css.replace(/:root/g, ":scope");
//     return css;
// }