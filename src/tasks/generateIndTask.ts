import { ListrTask } from "listr2";
import { Config } from "../config";
import { writeFileSync } from "fs";
import { join } from "path";

export const generateIndTask = (config: Config): ListrTask => {
  const processSchema = async (path: string, baseURL: string) => {
    let renderData = `import Axios, { AxiosInstance } from "axios";` + "\n";
    renderData += `import { getFunctions } from "./impl";` + "\n\n";
    renderData += `export * as sdk from "./impl";` + "\n";
    renderData += `export * as default from "./impl";` + "\n\n";

    renderData +=
      `interface Opts {
  axios?: AxiosInstance;
}` + "\n\n";

    renderData +=
      `export function createClient({ axios }: Opts) {
  const axiosInstance =
    axios ||
    Axios.create({
      baseURL: "${baseURL}",
    });

  const functions = getFunctions(axiosInstance);

  return {
    axiosInstance,
    ...functions,
  };
}` + "\n";

    writeFileSync(join(process.cwd(), path, "index.ts"), renderData);
  };

  return {
    title: `generate types file`,
    task: async (ctx) => {
      const { targetConfig } = ctx;
      return await processSchema(
        targetConfig.output.path,
        targetConfig.input.axios.baseUrl
      );
    },
  };
};
