// To parse this data:
//
//   import { Convert } from "./file";
//
//   const orderBorrowReturn = Convert.toOrderBorrowReturn(json);

export interface OrderBorrowReturn {
    order_id:               number;
    equipmentlist_id:       string;
    borrowing_returning_id: string;
    order_count:            number;
}

// Converts JSON strings to/from your types
export class Convert {
    public static toOrderBorrowReturn(json: string): OrderBorrowReturn[] {
        return JSON.parse(json);
    }

    public static orderBorrowReturnToJson(value: OrderBorrowReturn[]): string {
        return JSON.stringify(value);
    }
}
