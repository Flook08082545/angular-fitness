import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/service/data.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(
    private router: Router,
    private http: HttpClient,
    private dataService: DataService
  ) {}

  onLogin() {
    const loginData = {
      email: this.email,
      password: this.password
    };

    if (!this.email || !this.password) {
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด!',
        text: 'กรุณากรอกข้อมูลให้ครบถ้วน',
      });
      return;
    }

    this.http.post(`${this.dataService.apiEndpoint}/login_member`, loginData).subscribe(
      (response: any) => {
        if (response.success) {
          const member = response.data;
          if (member.member_status === 'Y') {
            Swal.fire({
              title: 'ถูกระงับการใช้งาน',
              text: 'คุณถูกระงับการใช้งาน กรุณาติดต่อผู้ดูแลระบบ',
              icon: 'warning',
              confirmButtonText: 'ตกลง'
            });
          } else if (member.member_status === 'N') {
            Swal.fire({
              title: 'สำเร็จ',
              text: 'เข้าสู่ระบบเรียบร้อย',
              icon: 'success',
              confirmButtonText: 'ตกลง'
            }).then(() => {
              // Store user data in sessionStorage
              sessionStorage.setItem('member_id', member.member_id.toString());
              sessionStorage.setItem('firstname', member.firstname.toString());
              sessionStorage.setItem('lastname', member.lastname.toString());
              this.router.navigate(['/fitnessitem']); // Navigate to fitnessitem page
            });
          }
        } else {
          Swal.fire('อีเมลและรหัสผ่านไม่ถูกต้อง', response.message, 'error');
        }
      },
      (error) => {
        Swal.fire('อีเมลและรหัสผ่านไม่ถูกต้อง!', 'เกิดข้อผิดพลาด', 'error');
        console.error('Login failed:', error);
      }
    );
  }
}
