// To parse this data:
//
//   import { Convert } from "./file";
//
//   const borrowingReturning = Convert.toBorrowingReturning(json);

export interface BorrowingReturning {
    borrowing_returning_id:     string;
    date_borrowing:             string;
    date_returning:             null;
    borrowing_returning_status: string;
    member_id:                  string;
    admin_id:                   null;
}

// Converts JSON strings to/from your types
export class Convert {
    public static toBorrowingReturning(json: string): BorrowingReturning[] {
        return JSON.parse(json);
    }

    public static borrowingReturningToJson(value: BorrowingReturning[]): string {
        return JSON.stringify(value);
    }
}
