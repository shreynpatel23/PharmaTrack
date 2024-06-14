export interface IProduct {
  _id?: string;
  productName?: string;
  drugCode?: string;
  strength?: string;
  quantity?: string;
  price?: string;
  supplier?: {
    _id?: string;
    firstName?: string;
    lastName?: string;
  };
  store?: {
    _id?: string;
    name?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}
