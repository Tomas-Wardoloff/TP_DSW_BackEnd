export class User {
  public id: string;
  public email: string;
  public password: string;
  public phone_number: string;
  public user_type: string;
  public created_at: Date;
  public is_active : boolean;
  public last_login: Date;

  public constructor(id: string, email: string,password: string,phone_number: string, user_type: string, created_at: Date, is_active : boolean, last_login: Date){
    this.id = id;
    this.email = email;
    this.password = password
    this.phone_number = phone_number;
    this.user_type = user_type;
    this.created_at = created_at;
    this.is_active = is_active;
    this.last_login = last_login;
  }
}