export class TerminalObjective {
  constructor(
    public readonly id: string,
    public title: string,
    public achieved: number,
    public objective: number,
    public pct: number,
    public isActive: boolean,
    public objectiveType: string,
    public rangeLabel?: string,
    public color: string = 'blue',
    public period?: string | null
  ) {}

  public toPlain() {
    return {
      id: this.id,
      title: this.title,
      name: this.title,
      achieved: this.achieved,
      objective: this.objective,
      pct: this.pct,
      isActive: this.isActive,
      objectiveType: this.objectiveType,
      rangeLabel: this.rangeLabel,
      color: this.color,
      period: this.period,
    };
  }
}
