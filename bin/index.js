#!/usr/bin/env node

const yargs = require("yargs");
const guillotine = require("../index");

const argv = yargs
    .command("*", "'npx guillotine' - running guillotine prompts", () => {
        guillotine.cli.Prompt();
    })
    .help().argv;
