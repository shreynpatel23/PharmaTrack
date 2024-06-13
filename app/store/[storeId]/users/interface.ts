export interface IUser {
  _id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  password?: string;
  status?: boolean;
  role?: {
    _id?: string;
    name?: string;
  };
  createdAt?: string;
  updatedAt?: string;
  store?: {
    _id?: string;
    name?: string;
  };
}
