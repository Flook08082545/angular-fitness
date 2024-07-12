// To parse this data:
//
//   import { Convert } from "./file";
//
//   const otp = Convert.toOtp(json);

export interface Otp {
    otp_id: number;
    email:  string;
    otp:    string;
}

// Converts JSON strings to/from your types
export class Convert {
    public static toOtp(json: string): Otp[] {
        return JSON.parse(json);
    }

    public static otpToJson(value: Otp[]): string {
        return JSON.stringify(value);
    }
}
