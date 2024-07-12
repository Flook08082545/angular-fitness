import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/service/data.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login-admin',
  templateUrl: './login-admin.component.html',
  styleUrls: ['./login-admin.component.scss'],
})
export class LoginAdminComponent implements OnInit {
  email: string = '';
  password: string = '';
  member_id: string = '';

  constructor(
    private router: Router,
    private http: HttpClient,
    private dataService: DataService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.member_id = params['member_id'] || '';
      if (this.member_id) {
        sessionStorage.setItem('member_id', this.member_id);
      }
    });
  }

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

    this.http.post(`${this.dataService.apiEndpoint}/login_admin`, loginData).subscribe(
      (response: any) => {
        if (response.success) {
          Swal.fire({
            title: 'สำเร็จ',
            text: 'เข้าสู่ระบบเรียบร้อย',
            icon: 'success',
            confirmButtonText: 'ตกลง'
          }).then(() => {
            const admin = response.data;
            // Store user data in sessionStorage
            sessionStorage.setItem('admin_id', admin.admin_id.toString());
            sessionStorage.setItem('firstname', admin.firstname.toString());
            sessionStorage.setItem('lastname', admin.lastname.toString());
            // Navigate to borroweditems without queryParams
            this.router.navigate(['/borroweditems']);
          });
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
