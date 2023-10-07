export function getFormatedSchema(schema: any) {
  const mappedSchema = schema.reduce((acc, crr) => {
    const { key, req, route, body, query } = crr;

    const paramsSchema = {
      type: "object",
      properties: {},
      additionalProperties: false,
      $schema: "http://json-schema.org/draft-07/schema#",
    };

    const matches = [...route.matchAll(/:(\w+)/g)];

    if (matches.length) {
      paramsSchema.properties = matches.reduce((acc, match) => {
        return {
          ...acc,
          [match[1]]: {
            type: "string",
          },
        };
      }, {});
      paramsSchema["required"] = matches.map((match) => match[1]);
    }

    const method = req as any;

    const required = [
      ...(body ? ["body"] : []),
      ...(query ? ["query"] : []),
      ...(Object.keys(paramsSchema.properties).length ? ["params"] : []),
    ];

    const newAcc = {
      ...acc,
      [key]: {
        method,
        data: {
          type: "object",
          properties: {
            ...(body ? { body: JSON.parse(body) } : {}),
            ...(query ? { query: JSON.parse(query) } : {}),
            ...(Object.keys(paramsSchema.properties).length
              ? { params: paramsSchema }
              : {}),
          },
          additionalProperties: false,
          $schema: "http://json-schema.org/draft-07/schema#",
          ...(required.length > 0 && { required }),
        },
        route,
      },
    };

    return newAcc;
  }, {});

  return mappedSchema;
}
