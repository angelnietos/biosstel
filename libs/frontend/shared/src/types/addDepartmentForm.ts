/**
 * @biosstel/shared - Form data for AddDepartmentModal (agnostic of API)
 */
export interface AddDepartmentFormData {
  code?: string;
  name: string;
  color?: string;
  responsibleUserId?: string;
  dateFrom?: string;
  dateTo?: string;
}
