export interface DeliveryAddress {
  id: number;
  address: string;
  contactPersonName: string;
  phone: string;
  customerId: number;
}

export interface Customer {
  id: number;
  customerId: string;
  customerName: string;
  address: string;
  businessStartDate: Date;
  customerType: string;
  phone: string;
  email: string;
  creditLimit: number;
  photoUrl: string;
  deliveryAddressInfo: DeliveryAddress[];
}
