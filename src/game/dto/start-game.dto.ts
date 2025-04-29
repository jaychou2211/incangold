import { addApiExamples, addApiSchema, Examples, Schema } from '@helper/api-doc';
import { IsArray, MinLength, MaxLength, IsString } from 'class-validator';

class StartGameDto {
  @IsArray()
  @MinLength(3)
  @MaxLength(8)
  @IsString({ each: true })
  explorerIds: string[];
}

addApiSchema(StartGameDto, {
  type: 'object',
  properties: {
    explorerIds: { type: 'array', items: { type: 'string' } },
  },
} satisfies Schema);

const explorerId1 = '7395ae67-239f-4485-8c56-3c16fe5252a3';
const explorerId2 = '009dcdd7-c1cc-4ad6-a15e-c19015e54433';
const explorerId3 = '38f2df5c-e5a9-4fc9-bf89-bddb74c12e15';
addApiExamples(StartGameDto, {
  'Start game': {
    value: { explorerIds: [explorerId1, explorerId2, explorerId3] },
  },
} satisfies Examples);

export { StartGameDto };
