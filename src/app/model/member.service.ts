// To parse this data:
//
//   import { Convert } from "./file";
//
//   const member = Convert.toMember(json);

export interface Member {
  member_id:        number;
  prefix:           string;
  firstname:        string;
  lastname:         string;
  email:            string;
  password:         string;
  sex:              string;
  telephone_number: number;
  member_status:    string;
}

// Converts JSON strings to/from your types
export class Convert {
  public static toMember(json: string): Member[] {
      return JSON.parse(json);
  }

  public static memberToJson(value: Member[]): string {
      return JSON.stringify(value);
  }
}
