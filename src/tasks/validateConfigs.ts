import kleur from "kleur";
import { Config } from "../config";

export const validateConfigs = (configs: Config[]) => {
  const errors: string[] = [];

  if (configs.length === 0) errors.push("config array is empty");

  configs.forEach((config, i) => {
    const whichConfig =
      configs.length === 1 ? "the config" : `config #${i + 1}`;

    if (!config.configFile)
      errors.push(
        `${whichConfig} is missing a 'configPath' property. Please specify a path to a config file.`
      );

    if (Object.keys(config.configFile).length === 0)
      errors.push(
        `${whichConfig} is empty. Please specify a target to a config file.`
      );

    let targetConfig: any = null;

    if (Object.keys(config.configFile).length === 1) {
      targetConfig = config.configFile[Object.keys(config.configFile)[0]];
    }
    if (!targetConfig.input && !targetConfig.output) {
      errors.push(
        `${whichConfig} is missing an 'input' or 'output' property. Please specify an input and output path.`
      );
    }
  });

  errors.forEach((error) => console.log(kleur.red(`Error: ${error}`)));

  return errors.length === 0;
};
