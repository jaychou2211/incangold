import { addApiExamples, addApiSchema, Examples, Schema } from '@helper/api-doc';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Decision } from '../domain';

class MakeDecisionDto {
  @IsString()
  @IsNotEmpty()
  explorerId: string;

  @IsEnum(Decision)
  decision: Decision;
}

addApiSchema(MakeDecisionDto, {
  type: 'object',
  properties: {
    explorerId: { type: 'string' },
    decision: { type: 'string', enum: [Decision.Adventure, Decision.Retreat] },
  },
} satisfies Schema);

const explorerId = '7395ae67-239f-4485-8c56-3c16fe5252a3';
addApiExamples(MakeDecisionDto, {
  'Keep exploring': {
    value: { explorerId, decision: Decision.Adventure },
  },
  'Retreat to camp': {
    value: { explorerId, decision: Decision.Retreat },
  },
} satisfies Examples);

export { MakeDecisionDto };
