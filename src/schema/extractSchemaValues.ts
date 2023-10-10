export const extractSchemaValues = (schemaPayload: any) => {
  const { payload } = schemaPayload;

  const fields = payload.map((line) => {
    const keyRegex = /<@key>(.*?)<\/@key>/;
    const reqRegex = /<@req>(.*?)<\/@req>/;
    const routeRegex = /<@route>(.*?)<\/@route>/;
    const bodyRegex = /<@body>(.*?)<\/@body>/;
    const queryRegex = /<@query>(.*?)<\/@query>/;
    const controllerRegex = /<@controller>(.*?)<\/@controller>/;

    const keyMatch = line.match(keyRegex);
    const reqMatch = line.match(reqRegex);
    const routeMatch = line.match(routeRegex);
    const bodyMatch = line.match(bodyRegex);
    const queryMatch = line.match(queryRegex);
    const controllerMatch = line.match(controllerRegex);

    const keyValue = keyMatch ? keyMatch[1] : null;
    const reqValue = reqMatch ? reqMatch[1] : null;
    const routeValue = routeMatch ? routeMatch[1] : null;
    const bodyValue = bodyMatch ? bodyMatch[1] : null;
    const queryValue = queryMatch ? queryMatch[1] : null;
    const controllerValue = controllerMatch ? controllerMatch[1] : null;

    return {
      key: keyValue,
      req: reqValue,
      route: routeValue,
      body: bodyValue,
      query: queryValue,
      controller: controllerValue,
    };
  });

  return fields;
};

export const getControllerKeyValue = (schema: any) => {
  const mappedSchema = schema.reduce((acc: any, crr: any) => {
    if (acc[crr.controller]) {
      return {
        ...acc,
        [crr.controller]: [...acc[crr.controller], crr],
      };
    } else {
      return {
        ...acc,
        [crr.controller]: [crr],
      };
    }
  }, {});

  return mappedSchema;
};
