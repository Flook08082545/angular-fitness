// To parse this data:
//
//   import { Convert } from "./file";
//
//   const orderselections = Convert.toOrderselections(json);

export interface Orderselections {
firstname: any;
  order_selections_id: number;
  equipmentlist_id: number;
  selections_id: number;
  device_id: string;
  equipment_name: string;
  count: number;
  unit: string;
  detail: string;
  approval_status: string;
  member_id: number;
}

// Converts JSON strings to/from your types
export class Convert {
  public static toOrderselections(json: string): Orderselections[] {
    return JSON.parse(json);
  }

  public static orderselectionsToJson(value: Orderselections[]): string {
    return JSON.stringify(value);
  }
}
