type FormFields = { [key: string]: 'string' | 'file' };

export function validateFieldType<T extends FormFields>(
  data: FormData,
  expect: T,
): { [P in keyof T]: T[P] extends 'string' ? string : File } {
  const fields: { [key: string]: string | File } = {};
  const missing: string[] = [];
  const wrongType: string[] = [];

  Object.keys(expect).forEach((key) => {
    const field = data.get(key);
    if (field === null) missing.push(key);
    else if (expect[key] === 'string') {
      if (typeof field === 'string') fields[key] = field as any;
      else wrongType.push(key);
    } else if (expect[key] === 'file') {
      if (typeof field !== 'string') fields[key] = field as any;
      else wrongType.push(key);
    }
  });

  if (missing.length > 0)
    throw new Error(`Form submitted incorrectly: missing fields ${missing}`);

  if (wrongType.length > 0)
    throw new Error(
      `Form submitted incorrectly: type mismatch in fields ${wrongType}`,
    );

  return fields as any;
}
