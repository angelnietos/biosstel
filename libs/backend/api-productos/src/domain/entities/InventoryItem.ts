export class InventoryItem {
  constructor(
    public readonly id: string,
    public codigo: string,
    public nombre: string,
    public cantidad: number,
    public ubicacion?: string
  ) {}

  public toPlain() {
    return {
      id: this.id,
      codigo: this.codigo,
      nombre: this.nombre,
      cantidad: this.cantidad,
      ubicacion: this.ubicacion,
    };
  }
}

export interface CreateInventoryInput {
  codigo: string;
  nombre: string;
  cantidad?: number;
  ubicacion?: string;
}

export interface UpdateInventoryInput {
  codigo?: string;
  nombre?: string;
  cantidad?: number;
  ubicacion?: string;
}
