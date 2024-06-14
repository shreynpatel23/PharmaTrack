export interface IOrder {
  _id?: string;
  type?: string;
  quantity?: number;
  amount?: number;
  status?: string;
  supplier?: string;
  createdBy?: {
    _id?: string;
    firstName?: string;
    lastName?: string;
  };
  product?: {
    _id?: string;
    productName?: string;
  };
  store?: {
    _id?: string;
    name?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}
