/*jslint es6*/
import riot from "rollup-plugin-riot";
import nodeResolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import buble from "rollup-plugin-buble";
import uglify from "rollup-plugin-uglify";
import postcss from "postcss";
import postcssCssnext from "postcss-cssnext";
import dotenv from "dotenv";

dotenv.config();

export default {
    input: "src/main.js",
    sourceMap: process.env.NODE_ENV === "development",
    output: {
        format: "iife",
        file: "dist/bundle.min.js"
    },
    plugins: [
        riot({
            style: "cssnext",
            parsers: {
              css: { cssnext }
            }
        }),
        nodeResolve({ jsnext: true }),
        commonjs(),
        buble(),
        uglify()
    ]
};

function cssnext (tagName, css) {
    css = css.replace(/:scope/g, ":root");
    css = postcss([postcssCssnext]).process(css).css;
    css = css.replace(/:root/g, ":scope");
    return css;
}
