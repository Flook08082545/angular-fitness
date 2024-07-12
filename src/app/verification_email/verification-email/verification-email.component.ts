import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { DataService } from 'src/app/service/data.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-verification-email',
  templateUrl: './verification-email.component.html',
  styleUrls: ['./verification-email.component.scss']
})
export class VerificationEmailComponent implements OnInit {

  registerData: any;

  constructor(private dataService: DataService, private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    // Retrieve data from sessionStorage
    const data = sessionStorage.getItem('registerData');
    if (data) {
      this.registerData = JSON.parse(data);
    } else {
      // Handle the case where there is no data in sessionStorage
      console.error('No registration data found in sessionStorage.');
      this.router.navigate(['/register']);
    }
  }

  onSubmit(event: Event, email: string) {
    // Prevent the default form submission behavior
    event.preventDefault();

    const email_otp = {
      email: email
    };

    this.http.post(`${this.dataService.apiEndpoint}/OTP_save`, email_otp).subscribe(
      (response: any) => {
        // Check if the API response contains the OTP
        if (response && response.otp) {

          // Successfully sent OTP
          Swal.fire('สำเร็จ', 'ส่งรหัส OTP ไปยังอีเมลเรียบร้อย', 'success').then(() => {
            sessionStorage.setItem('otp', response.otp);
            // Navigate to verification code page
            this.router.navigate(['/verification_code'], { queryParams: { email: email } });
          });
        } else {
          // API response does not contain OTP
          Swal.fire('Error!', 'Failed to send OTP.', 'error');
          console.error('Sending OTP failed: No OTP received from API response');
        }
      },
      (error) => {
        // Error while sending OTP
        Swal.fire('Error!', 'Failed to send OTP.', 'error');
        console.error('Sending OTP failed:', error);
      }
    );
  }
}
