// To parse this data:
//
//   import { Convert } from "./file";
//
//   const selections = Convert.toSelections(json);

export interface Selections {
  selections_id: number;
  equipmentlist_id: number;
  device_id: string;
  picture: string;
  equipment_name: string;
  count: number;
  unit: string;
  detail: string;
  member_id: number;
}

// Converts JSON strings to/from your types
export class Convert {
  public static toSelections(json: string): Selections[] {
    return JSON.parse(json);
  }

  public static selectionsToJson(value: Selections[]): string {
    return JSON.stringify(value);
  }
}
