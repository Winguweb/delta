import { ZodError, ZodSchema } from 'zod';

function checkErrors<T = Record<string, string>>(
  schema: ZodSchema<any>,
  data: Record<string, unknown>,
  initialErrors: T
): T {
  try {
    schema.parse(data);
    return initialErrors;
  } catch (e) {
    const err = e as ZodError;

    const entityErrors = { ...initialErrors };

    err.errors.forEach((error) => {
      (entityErrors as unknown as Record<string, string>)[error.path[0]] =
        error.message;
    });

    return entityErrors;
  }
}

export default checkErrors;
