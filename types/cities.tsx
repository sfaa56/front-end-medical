export type PostalCode = { code: string; active: boolean, _id?: string };

export type District = {
  _id?: string;
  name: string;
  active: boolean;
  postalCodes: PostalCode[];
  newPostalCode?: string;
};

export type City = { _id?:string, name: string; active: boolean; districts: District[] };