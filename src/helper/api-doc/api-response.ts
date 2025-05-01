import { ApiResponseOptions } from '@nestjs/swagger';
type ContentObject = Required<Pick<ApiResponseOptions, 'content'>>['content'];
type MediaTypeObject = ContentObject[string];
export type Schema = MediaTypeObject['schema'];
export type Example = MediaTypeObject['example'];

export function addApiResponseSchema<T>(
  dto: { new (...args: unknown[]): T },
  schema: Schema
) {
  // @ts-expect-error - Adding schema definition to dto class for Swagger documentation
  dto.schema = schema;
}

export function addApiResponseExample<T>(
  dto: { new (...args: unknown[]): T },
  example: Example
) {
  // @ts-expect-error - Adding examples definition to dto class for Swagger documentation
  dto.example = example;
}

export function getApiResponseMetadataFromDto<T>(
  dto: { new (...args: unknown[]): T },
) {
  return {
    content: {
      'application/json': {
        // @ts-expect-error - extracting schema definition from dto class for Swagger documentation
        schema: dto.schema,
        // @ts-expect-error - extracting example definition from dto class for Swagger documentation
        example: dto.example,
      } satisfies MediaTypeObject,
    },
  } satisfies ApiResponseOptions;
}
