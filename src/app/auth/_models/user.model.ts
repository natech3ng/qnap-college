
export class User {
  _id: string;
  email: string;
  password: string;
  token: string;
  name: string;

  constructor(email?: string, name?: string) {
    this.email = email ? email: '';
    this.name = name ? name: '';
  }
}
