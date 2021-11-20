export default interface Database {
    registerUser(email:string,hashedPass:string):boolean;
    loginUser(email:string,hashedPass:string):string;
  }