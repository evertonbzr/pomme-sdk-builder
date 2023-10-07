import { ListrTask } from "listr2";
import { Config } from "../config";
import { writeFileSync } from "fs";
import { join } from "path";

export const generateIndTask = (config: Config): ListrTask => {
  const processSchema = async (path: string) => {
    let renderData = `export * as sdk from "./impl";` + "\n";
    renderData += `export * as default from "./impl";` + "\n";

    writeFileSync(join(process.cwd(), path, "index.ts"), renderData);
  };

  return {
    title: `generate types file`,
    task: async (ctx) => {
      const { targetConfig } = ctx;
      return await processSchema(targetConfig.output.path);
    },
  };
};
