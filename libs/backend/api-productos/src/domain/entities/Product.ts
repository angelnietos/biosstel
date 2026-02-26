/**
 * Entidad de dominio Product.
 * Pura: sin dependencias de TypeORM ni de ningún framework.
 * El dominio no conoce infraestructura.
 */
export class Product {
  constructor(
    public readonly id: string,
    public readonly codigo: string | undefined,
    public readonly nombre: string,
    public readonly familia: string,
    public readonly estado: string,
    public readonly familyId?: string,
    public readonly subfamilyId?: string,
    public readonly brandId?: string
  ) {}

  /** Serialización para capa de presentación/API (compatible con contrato shared-types). */
  toPlain(): {
    id: string;
    codigo?: string;
    nombre: string;
    name?: string;
    familia: string;
    familyId?: string;
    subfamilyId?: string;
    brandId?: string;
    estado: string;
  } {
    return {
      id: this.id,
      codigo: this.codigo,
      nombre: this.nombre,
      name: this.nombre,
      familia: this.familia,
      familyId: this.familyId,
      subfamilyId: this.subfamilyId,
      brandId: this.brandId,
      estado: this.estado,
    };
  }
}

/** Forma serializable para API/contratos (shared-types). */
export type ProductPlain = ReturnType<Product['toPlain']>;

/** Datos para crear un producto (entrada al dominio). */
export interface CreateProductInput {
  codigo: string;
  nombre: string;
  familia?: string;
  estado?: string;
}

/** Datos para actualizar un producto (entrada al dominio). */
export interface UpdateProductInput {
  codigo?: string;
  nombre?: string;
  familia?: string;
  estado?: string;
}
