import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root',
})
export class DataService {
  apiEndpoint = 'http://localhost/fitness';
  // apiEndpoint = '/fitness';
  memberId: string = ''; // เพิ่มตัวแปรสำหรับเก็บ member_id
  userRole: string = ''; // เพิ่มตัวแปรสำหรับเก็บ userRole

  constructor(private http: HttpClient) {}

  private memberData: any;

  setMemberData(data: any) {
    this.memberData = data;
  }

  getMemberData() {
    return this.memberData;
  }

  // เมื่อ login สำเร็จให้เซ็ตค่า member_id
  setMemberId(memberId: string): void {
    this.memberId = memberId;
  }

  // ดึงค่า member_id
  getMemberId(): string {
    return this.memberId;
  }

  // ฟังก์ชันเพื่อดึงข้อมูลบทบาทของผู้ใช้
  getUserRole(): string {
    // ในที่นี้คุณอาจจะต้องดึงข้อมูลบทบาทจากเซิร์ฟเวอร์หรือจากที่เก็บข้อมูล
    // โดยตัวอย่างเช่นการใช้ HTTP request หรือการอ่านข้อมูลจาก localStorage หรือ Cookies
    // และคืนค่าบทบาทกลับมา
    return this.userRole;
  }

  // ฟังก์ชันเพื่อกำหนดค่าบทบาทของผู้ใช้
  setUserRole(role: string): void {
    this.userRole = role;
  }
  sendOtp(email: string): Observable<any> {
    return this.http.post(this.apiEndpoint, { email });
  }
}
