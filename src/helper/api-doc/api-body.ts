import { ApiBodyOptions } from '@nestjs/swagger';
type ApiBodySchemaHost = Extract<ApiBodyOptions, { schema: unknown }>;
export type Schema = ApiBodySchemaHost['schema'];
export type Examples = ApiBodySchemaHost['examples'];

export function addApiSchema<T>(
  dto: { new (...args: unknown[]): T },
  schema: Schema
) {
  // @ts-expect-error - Adding schema definition to dto class for Swagger documentation
  dto.schema = schema;
}

export function addApiExamples<T>(
  dto: { new (...args: unknown[]): T },
  examples: Examples
) {
  // @ts-expect-error - Adding examples definition to dto class for Swagger documentation
  dto.examples = examples;
}

export function getApiBodySchemaHostFromDto<T>(
  dto: { new (...args: unknown[]): T },
) {
  return {
    // @ts-expect-error - extracting schema definition from dto class for Swagger documentation
    schema: dto.schema,
    // @ts-expect-error - extracting examples definition from dto class for Swagger documentation
    examples: dto.examples,
  } satisfies ApiBodySchemaHost;
}
