
export class User {
  _id: string;
  email: string;
  password: string;
  token: string;
  name: string;
  firstName: string;
  lastName: string;
  commentCount: number;
  role: {
    name: string;
    level: number;
  };

  constructor(email?: string, name?: string) {
    this.email = email ? email: '';
    this.name = name ? name: '';
    this.commentCount = 0;
  }
}
