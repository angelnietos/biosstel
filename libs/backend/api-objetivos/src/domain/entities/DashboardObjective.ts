export class DashboardObjective {
  constructor(
    public readonly id: string,
    public title: string,
    public achieved: number,
    public objective: number,
    public accent: string = 'blue',
    public isActive: boolean = true,
    public unit?: string,
    public href?: string
  ) {}

  public toPlain() {
    return {
      id: this.id,
      title: this.title,
      name: this.title,
      achieved: this.achieved,
      objective: this.objective,
      unit: this.unit,
      href: this.href,
      accent: this.accent,
      color: this.accent,
      isActive: this.isActive,
    };
  }
}
