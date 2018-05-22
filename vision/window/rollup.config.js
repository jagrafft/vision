/*jslint es6*/
import buble from "rollup-plugin-buble";
import commonjs from "rollup-plugin-commonjs";
import dotenv from "dotenv";
import nodeResolve from "rollup-plugin-node-resolve";
import path from "path";
import postcss from "postcss";
import postcssCssnext from "postcss-cssnext";
import riot from "rollup-plugin-riot";
import uglify from "rollup-plugin-uglify";

dotenv.config();

export default {
    input: path.join(__dirname, "src/main.js"),
    output: {
        format: "iife",
        file: path.join(__dirname, "dist/bundle.min.js"),
        sourcemap: process.env.NODE_ENV === "development",
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
