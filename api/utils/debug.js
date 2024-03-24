const levels = {
  NONE: 0,
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
};

let currentLevel = levels.HIGH;

const log = {
  setLevel: (l) => (currentLevel = l),

  parameterLogGroup: (parameters) => {
        if (levels.HIGH > currentLevel) {
          return;
        }
        console.groupCollapsed(`Parameters:`);
        parameters.forEach((p) => console.log(`${p.name}:`, p.value));
        console.groupEnd();
      },

      functionName: (name) => {
        if (levels.MEDIUM > currentLevel) {
          return;
        }
        console.log(`\nEXECUTING: ${name}\n`);
      },

      flow: (flow) => {
        if (levels.LOW > currentLevel) {
          return;
        }
        console.log(`\n\n\nBEGIN FLOW: ${flow}\n\n\n`);
      },

      variable: ({ name, value }) => {
        if (levels.HIGH > currentLevel) {
          return;
        }
        console.groupCollapsed(`VARIABLE ${name}:`);
        console.log(value);
        console.groupEnd();
      },

      request: (req, res, next) => {
        if (levels.HIGH > currentLevel) {
          return next();
        }
        console.log('Hit URL', req.url);
        console.groupCollapsed('Request details:');
        console.log('Query:', req.query);
        console.log('Body:', req.body);
        console.groupEnd();
        return next();
      },
};

module.exports = {
  levels,
  ...log,
};
