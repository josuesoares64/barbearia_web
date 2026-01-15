export type Booking = {
  date: string;
  service_id: number | null; // ID para a API
  service_name: string;      // Nome para exibição no resumo
  barber_id: number | null;  // ID para a API
  barber_name: string;       // Nome para exibição
  time: string;
  name: string;
  phone: string;
};