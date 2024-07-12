import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/service/data.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-verification-code',
  templateUrl: './verification-code.component.html',
  styleUrls: ['./verification-code.component.scss'],
})
export class VerificationCodeComponent implements OnInit {
  email: string | null = null;
  otp: string = '';
  attemptCount: number = 0;
  maxAttempts: number = 3;
  registerData: any;
  sessionOTP: any;

  constructor(
    private dataService: DataService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.email = params['email'];
    });

    // Retrieve the registerData from sessionStorage
    const data = sessionStorage.getItem('registerData');
    if (data) {
      this.registerData = JSON.parse(data);
    } else {
      // Handle the case where there is no data in sessionStorage
      console.error('No registration data found in sessionStorage.');
      this.router.navigate(['/register']);
    }

    // Get the OTP from session
    //this.sessionOTP = sessionStorage.getItem('otp');
  }

  onResend(event: Event) {
    event.preventDefault();

    if (!this.email) {
      Swal.fire('Error!', 'Email is required to resend OTP.', 'error');
      return;
    }

    // Clear the previous OTP from session storage
    sessionStorage.removeItem('otp');

    this.http.post(`${this.dataService.apiEndpoint}/OTP_save`, { email: this.email }).subscribe(
      (response: any) => {
        // ตรวจสอบว่าการตอบสนองของ API มี OTP หรือไม่
        if (response && response.otp) {
          // ส่ง OTP สำเร็จ
          Swal.fire('สำเร็จ', 'รหัส OTP ได้ส่งไปที่ Email ของคุณแล้ว', 'success').then(() => {
            // เก็บ OTP ใหม่ใน session storage
            sessionStorage.setItem('otp', response.otp);
            // แสดงค่า OTP ใน console
            console.log('OTP ถูกเก็บใน session storage:', response.otp);
          });
        } else {
          // การตอบสนองของ API ไม่มี OTP
          Swal.fire('เกิดข้อผิดพลาด!', 'การส่ง OTP ล้มเหลว.', 'error');
          console.error('การส่ง OTP ล้มเหลว: ไม่มี OTP ที่ได้รับจากการตอบสนองของ API');
        }
      },
      (error) => {
        // เกิดข้อผิดพลาดขณะส่ง OTP
        Swal.fire('เกิดข้อผิดพลาด!', 'การส่ง OTP ล้มเหลว.', 'error');
        console.error('การส่ง OTP ล้มเหลว:', error);
      }
    );
  }    

  onVerify(otp: any) {
    // Get the OTP from session storage
    const storedOTP = sessionStorage.getItem('otp');

    // Compare user input with stored OTP
    if (otp === storedOTP) {
      Swal.fire('สำเร็จ', 'รหัส OTP ถูกต้อง', 'success').then(() => {
        // Save the registerData to the backend
        this.saveRegisterData();
      });
    } else {
      this.attemptCount++;
      if (this.attemptCount >= this.maxAttempts) {
        Swal.fire('เกิดข้อผิดพลาด!', 'คุณได้กรอก OTP ผิดหลายครั้งเกินไป.', 'error').then(() => {
          this.router.navigate(['/login']);
        });
      } else {
        Swal.fire('เกิดข้อผิดพลาด!', 'OTP ไม่ถูกต้อง คุณยังเหลือ ${this.maxAttempts - this.attemptCount} ครั้งในการลองใหม่.', 'error');      
      }
      console.error('Verifying OTP failed:');
    }
  }

  saveRegisterData() {
    this.http.post(`${this.dataService.apiEndpoint}/register_save`, this.registerData).subscribe(
      (response: any) => {
        Swal.fire('Success', 'Registration successful', 'success').then(() => {
          this.router.navigate(['/login']);
        });
      },
      (error) => {
        Swal.fire('Error!', 'Failed to register.', 'error');
        console.error('Registering user failed:', error);
      }
    );
  }
}
