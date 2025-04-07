export interface Patient {
  id: number;
  name: string;
  surname: string;
  email?: string;
  phone_number?: string;
  address?: string;
  birth_number?: string;
  insurance_company?: string;
}