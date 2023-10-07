#!/usr/bin/env node
import kleur from "kleur";
import yargs from "yargs";
import { Config } from "./config";
import { validateConfigs } from "./tasks/validateConfigs";
import { existsSync, readFileSync } from "fs";
import { generate } from "./main";
import { join } from "path";

const program: any = yargs
  .option("config", {
    alias: "c",
    description: "Config file",
    required: false,
    default: "pomme.config.json",
    type: "string",
  })
  .option("target", {
    alias: "t",
    description: "Target config",
    required: false,
    type: "string",
  })
  .option("verbose", {
    alias: "v",
    type: "boolean",
    default: false,
  })
  .help("help")
  .parse();

const config: Config = {
  configFile: program.config && readFile(join(process.cwd(), program.config)),
};

if (!validateConfigs([config])) [process.exit(1)];

generate(config)
  .catch((e: any) => {
    console.error(kleur.red("Cannot generate, got an error:"));
    console.error(e);
    process.exit(1);
  })
  .then(() => {
    printHelp();
  });

export function printHelp() {
  console.log();
  console.log(`${kleur.green("Success!")} Generated client sdk`);
  console.log();
  console.log();
}

function readFile(p) {
  if (!existsSync(p)) {
    console.log(`file '${p}' does not exist`);
    process.exit(1);
  }
  const file = readFileSync(p, "utf-8");

  return JSON.parse(file);
}
