import { ListrTask } from "listr2";
import { Config } from "../config";
import { writeFileSync } from "fs";
import { join } from "path";
import { render } from "ejs";
import { getControllerKeyValue } from "../schema/extractSchemaValues";

export const generateImplTask = (config: Config): ListrTask => {
  const processSchema = async (
    schema: any[],
    mappedTypesArgs: any[],
    targetConfig: any
  ) => {
    const { path } = targetConfig.output;

    let renderData = `import * as t from './types';` + "\n\n";
    renderData +=
      `import { AxiosInstance, AxiosRequestConfig } from "axios";` + "\n\n";

    renderData +=
      `export const getFunctions = (axiosInstance: AxiosInstance) => {` + "\n";

    const mappedController = getControllerKeyValue(schema);
    Object.keys(mappedController).forEach((controllerName) => {
      const items = mappedController[controllerName];

      renderData += `  const ${controllerName} = {` + "\n";

      items.forEach((item: any) => {
        const hasArgs = mappedTypesArgs.find((arg) => arg.key === item.key);

        let func =
          `    async ${item.key}(${
            hasArgs ? `args: t.${hasArgs.name}, ` : ""
          }opts?: AxiosRequestConfig) {` + "\n";

        func += `      let path = "${item.route}"` + "\n";

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
          ...opts
        });
        return response;
      } catch (error) {
        throw error;
      }
    },`;

        renderData += func + "\n";
      });
      renderData += `  };\n`;
    });

    renderData += `  return {\n`;

    Object.keys(mappedController).forEach((controllerName) => {
      renderData += `    ${controllerName},\n`;
    });

    renderData += `  };\n`;

    renderData += `};` + "\n";

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
