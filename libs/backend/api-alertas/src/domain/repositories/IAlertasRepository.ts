import type { Alert } from "../entities";


export const I_ALERTAS_REPOSITORY = Symbol('IAlertasRepository');

export interface IAlertasRepository {
  findAllActive(): Promise<Alert[]>;
}
