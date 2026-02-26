export class DashboardAlert {
  constructor(
    public readonly id: string,
    public usuario: string,
    public departamento: string,
    public centroTrabajo: string,
    public estado: string,
    public isActive: boolean = true,
    public rol?: string,
    public marca?: string,
    public statusType?: 'tienda' | 'telemarketing' | 'comercial' | 'no-fichado' | 'fuera-horario',
    public sortOrder: number = 0
  ) {}

  public toPlain() {
    return {
      id: this.id,
      usuario: this.usuario,
      departamento: this.departamento,
      centroTrabajo: this.centroTrabajo,
      rol: this.rol,
      estado: this.estado,
      statusType: this.statusType,
      marca: this.marca,
      isActive: this.isActive,
    };
  }
}
