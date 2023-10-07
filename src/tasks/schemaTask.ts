import { Config } from "../config";
import { ListrTask } from "listr2";
import { fetchSchema } from "../schema/fetchSchema";
import { extractSchemaValues } from "../schema/extractSchemaValues";

export const schemaTask = (config: Config): ListrTask => {
  const configTarget: any = Object.values(config.configFile)[0];

  const {
    input: { targetUrl },
  } = configTarget;

  const processSchema = (schema: any) => {
    const extractedSchema = extractSchemaValues(schema);
    return extractedSchema;
  };

  return {
    title: `fetching schema ${targetUrl}`,
    task: async (ctx) => {
      ctx.targetConfig = configTarget;
      ctx.schema = processSchema(
        await fetchSchema({
          endpoint: targetUrl,
        })
      );
    },
  };
};
