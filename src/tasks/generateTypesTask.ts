import { ListrTask } from "listr2";
import { Config } from "../config";

import { compile } from "json-schema-to-typescript";
import { getFormatedSchema } from "../utils/generator-utils";
import { writeFileSync } from "fs";
import { join } from "path";

function capitalizeString(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const generateTypesTask = (config: Config): ListrTask => {
  const processSchema = async (schema: any[], targetConfig: any) => {
    const { path } = targetConfig.output;
    const formatedSchema = getFormatedSchema(schema);
    const fields = Object.keys(formatedSchema);

    let types: any[] = [];

    let mappedTypesArgs: any[] = [];

    for (const field of fields) {
      const name = `${capitalizeString(field)}Args`;

      const content: any = await new Promise((resolve, reject) => {
        if (
          Object.keys(formatedSchema[field].data.properties || {}).length > 0
        ) {
          compile(formatedSchema[field].data, name, {
            bannerComment: "",
          })
            .then((ts) => {
              resolve(ts);
            })
            .catch((e) => {
              reject(e);
            });
        } else {
          resolve(null);
        }
      });

      if (content) {
        types.push(content);
        mappedTypesArgs.push({
          key: field,
          name,
        });
      }
    }

    let renderData = "";

    types.forEach((type) => {
      renderData += type + "\n";
    });

    writeFileSync(join(process.cwd(), path, "types.ts"), renderData);

    return mappedTypesArgs;
  };

  return {
    title: `generate types file`,
    task: async (ctx) => {
      const { schema, targetConfig } = ctx;
      const response = await processSchema(schema, targetConfig);
      ctx.mappedTypesArgs = response;
    },
  };
};
