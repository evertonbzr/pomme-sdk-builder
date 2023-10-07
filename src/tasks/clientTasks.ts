import { ListrTask } from "listr2";
import { Config } from "../config";
import { generateTypesTask } from "./generateTypesTask";
import { generateImplTask } from "./generateImplTask";
import { generateIndTask } from "./generateIndTask";
import { ensureDirSync } from "fs-extra";
import { join } from "path";

export const clientTasks = (config: Config): ListrTask[] => {
  return [
    {
      task: async (ctx) => {
        const {
          output: { path },
        } = ctx.targetConfig;
        ensureDirSync(join(process.cwd(), path));
      },
    },
    generateTypesTask(config),
    generateImplTask(config),
    generateIndTask(config),
  ];
};
