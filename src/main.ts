import { Config } from "./config";
import { Listr } from "listr2";
import { schemaTask } from "./tasks/schemaTask";
import { clientTasks } from "./tasks/clientTasks";
export const generate = async (config: Config): Promise<void> => {
  return new Listr(
    [
      {
        title: "Generating client code",
        task: () => new Listr([schemaTask(config), ...clientTasks(config)]),
      },
    ],
    {
      renderer: false ? "verbose" : "default",
      exitOnError: true,
    }
  )
    .run()
    .catch((e) => {
      throw e?.errors?.[0];
    });
};
