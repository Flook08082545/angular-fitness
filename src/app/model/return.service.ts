// To parse this data:
//
//   import { Convert } from "./file";
//
//   const orderreturn = Convert.toOrderreturn(json);

export interface Orderreturn {
  borrowing_returning_status: string;
  borrowing_returning_id: number;
  orderreturn_id: number;
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
  public static toOrderreturn(json: string): Orderreturn[] {
    return JSON.parse(json);
  }

  public static orderreturnToJson(value: Orderreturn[]): string {
    return JSON.stringify(value);
  }
}
