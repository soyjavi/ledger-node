export const ERROR = {
  FORBIDDEN: (res) => res.status(403).json({ message: "Forbidden." }),

  MESSAGE: (res, error = {}) =>
    res.status(400).json({ message: error.message }),

  NOT_FOUND: (res) => res.status(404).json({ message: "Resource not found." }),

  REQUIRED_PARAMETERS: (res, parameters) =>
    res.status(400).json({ message: `Required parameters: ${parameters}` }),

  UNKNOWN_SERVICE: (res) =>
    res.status(400).json({ message: "Unknown service." }),
};
