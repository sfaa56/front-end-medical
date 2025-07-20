
export interface User{
    _id?:string;
    name:string;
    email:string;
    role?:string;
    token?:string;
    phoneNumber?:string;
    image:{url:string,publicId:string}
}