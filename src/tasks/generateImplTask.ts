import { ListrTask } from "listr2";
import { Config } from "../config";
import { writeFileSync } from "fs";
import { join } from "path";

export const generateImplTask = (config: Config): ListrTask => {
  const processSchema = async (
    schema: any[],
    mappedTypesArgs: any[],
    targetConfig: any
  ) => {
    const { path } = targetConfig.output;

    let renderData = `import * as t from './types';` + "\n\n";
    renderData +=
      `import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: '${targetConfig.input.axios.baseUrl}',  
});` + "\n\n";

    schema.forEach((item) => {
      const hasArgs = mappedTypesArgs.find((arg) => arg.key === item.key);

      let func =
        `export async function ${item.key}(${
          hasArgs ? `args: t.${hasArgs.name}` : ""
        }) {` + "\n";

      func += `  let path = "${item.route}"` + "\n";

      const paramRegex = /:([^/]+)/g;
      const paramMatch = paramRegex.test(item.route);

      const param = paramMatch
        ? `
  const params = args.params;

  for (const paramKey in params) {
    if (params.hasOwnProperty(paramKey)) {
      const value = params[paramKey];
      path = path.replace(\`:\${paramKey}\`, value.toString());
   }
  }
    `
        : "";

      const bodyMatch = item.body ? `args.body` : `null`;
      const queryMatch = item.query ? `args.query` : `null`;

      func += param;

      func += `
  try {
    const response = await axiosInstance({
      method: '${String(item.req).toLowerCase()}',
      data: ${bodyMatch},
      params: ${queryMatch},
      url: path,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}`;

      renderData += func + "\n\n";
    });

    writeFileSync(join(process.cwd(), path, "impl.ts"), renderData);
  };

  return {
    title: `generate implementation file`,
    task: async (ctx) => {
      const { mappedTypesArgs, schema, targetConfig } = ctx;
      return await processSchema(schema, mappedTypesArgs, targetConfig);
    },
  };
};
