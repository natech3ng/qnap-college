
export class User {
  id: number;
  email: string;
  password: string;
  token: string;
  name: string;

  constructor() {
    this.email = '';
    this.name = '';
  }
}
