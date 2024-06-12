export interface ISupplier {
  _id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  location?: {
    addressLine1?: string;
    addressLine2?: string;
    postalCode?: string;
    city?: string;
    provience?: string;
    country?: string;
    _id?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}
