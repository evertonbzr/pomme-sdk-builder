export const extractSchemaValues = (schemaPayload: any) => {
  const { payload } = schemaPayload;

  const fields = payload.map((line) => {
    const keyRegex = /<@key>(.*?)<\/@key>/;
    const reqRegex = /<@req>(.*?)<\/@req>/;
    const routeRegex = /<@route>(.*?)<\/@route>/;
    const bodyRegex = /<@body>(.*?)<\/@body>/;
    const queryRegex = /<@query>(.*?)<\/@query>/;

    const keyMatch = line.match(keyRegex);
    const reqMatch = line.match(reqRegex);
    const routeMatch = line.match(routeRegex);
    const bodyMatch = line.match(bodyRegex);
    const queryMatch = line.match(queryRegex);

    const keyValue = keyMatch ? keyMatch[1] : null;
    const reqValue = reqMatch ? reqMatch[1] : null;
    const routeValue = routeMatch ? routeMatch[1] : null;
    const bodyValue = bodyMatch ? bodyMatch[1] : null;
    const queryValue = queryMatch ? queryMatch[1] : null;

    return {
      key: keyValue,
      req: reqValue,
      route: routeValue,
      body: bodyValue,
      query: queryValue,
    };
  });

  return fields;
};
