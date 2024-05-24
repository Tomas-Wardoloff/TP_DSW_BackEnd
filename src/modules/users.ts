export class User {
  constructor(
    private id: number,
    private email: string,
    private contact: string,
    private type: string,
    private created_at: Date,
    private is_asctive : boolean,
  ){}
}