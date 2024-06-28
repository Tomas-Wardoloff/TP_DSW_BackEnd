export class User {
  public id: string;
  public email: string;
  public phone_number: string;
  public type: string;
  public created_at: Date;
  public is_active : boolean;
  public last_login: Date;

  public constructor(id: string, email: string, phone_number: string, type: string, created_at: Date, is_active : boolean, last_login: Date){
    this.id = id;
    this.email = email;
    this.phone_number = phone_number;
    this.type = type;
    this.created_at = created_at;
    this.is_active = is_active;
    this.last_login = last_login;
  }
}