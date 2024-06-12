export interface ICustomer {
  _id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  store?: {
    _id?: string;
    name?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}
