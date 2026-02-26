export class TerminalAssignment {
  constructor(
    public readonly id: string,
    public groupType: 'department' | 'person',
    public groupTitle: string,
    public label: string,
    public value: number,
    public total: number,
    public ok: boolean,
    public sortOrder: number = 0
  ) {}

  public toPlain() {
    return {
      id: this.id,
      groupType: this.groupType,
      groupTitle: this.groupTitle,
      label: this.label,
      value: this.value,
      total: this.total,
      ok: this.ok,
      sortOrder: this.sortOrder,
    };
  }
}
