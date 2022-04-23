export default interface IDatabase {
    registerUser(email:string, firstName:string ,hashedPass:string):Promise<any>;
    getUser(email:string):object;
    getUserbyID(id:string):object;
  }