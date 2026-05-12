export function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    if (!result.success) {
      const errors = result.error.flatten();
      return res.status(422).json({ error: 'Validation failed', details: errors.fieldErrors });
    }
    req.validated = result.data;
    next();
  };
}
