// To parse this data:
//
//   import { Convert } from "./file";
//
//   const equipmentlist = Convert.toEquipmentlist(json);

export interface Equipmentlist {
  equipmentlist_id:      number;
  equipmentlist_picture: string;
  equipmentlist_name:    string;
  equipmentlist_count:   number;
  equipmentlist_unit:    string;
  equipmentlist_detail:  string;
  admin_id:              number;
  equipmentlist_old_id:  string;
}

// Converts JSON strings to/from your types
export class Convert {
  public static toEquipmentlist(json: string): Equipmentlist[] {
      return JSON.parse(json);
  }

  public static equipmentlistToJson(value: Equipmentlist[]): string {
      return JSON.stringify(value);
  }
}
