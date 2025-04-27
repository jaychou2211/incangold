import { ArtifactCard } from './cards';

export class Camp {
  constructor(
    public points: number = 0,
    public artifacts: ArtifactCard[] = []
  ) {}
}
