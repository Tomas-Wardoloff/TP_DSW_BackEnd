export class User {
  public id: string;
  public email: string;
  public contact: string;
  public type: string;
  public created_at: Date;
  public is_active : boolean;

  public constructor(id: string, email: string, contact: string, type: string, created_at: Date, is_active : boolean){
    this.id = id;
    this.email = email;
    this.contact = contact;
    this.type = type;
    this.created_at = created_at;
    this.is_active = is_active;
  }
}