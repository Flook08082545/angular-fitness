import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/service/data.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-admin',
  templateUrl: './add-admin.component.html',
  styleUrls: ['./add-admin.component.scss'],
})
export class AddAdminComponent {
  admin_id: string;
  firstname_new: string;
  lastname_new: string;
  member_id: string;

  constructor(
    private dataService: DataService,
    private http: HttpClient,
    private router: Router,
  ) {
    this.admin_id = sessionStorage.getItem('admin_id') || '';
    this.firstname_new = sessionStorage.getItem('firstname') || '';
    this.lastname_new = sessionStorage.getItem('lastname') || '';
    this.member_id = sessionStorage.getItem('member_id') || '';

    if (!this.admin_id) {
      this.router.navigate(['/login_admin']);
    }
  }

  save_admin(
    prefix: any,
    firstname: any,
    lastname: any,
    email: any,
    password: any,
    sex: any,
    telephone_number: any
  ) {
    const save_admin = {
      prefix: prefix,
      adminId: this.admin_id,
      firstname: firstname,
      lastname: lastname,
      email: email,
      password: password,
      sex: sex,
      telephone_number: telephone_number,
    };

    this.http.post(`${this.dataService.apiEndpoint}/add_admin_new`, save_admin)
  .subscribe(
    (response: any) => {
      Swal.fire('สำเร็จ', 'บันทึกข้อมูลเรียบร้อย', 'success')
        .then(() => {
          this.router.navigate(['/admin']); // หลังจากบันทึกสำเร็จ นำไปที่หน้าแอดมิน
        });
    },
    (error) => {
      Swal.fire('ผิดพลาด!', error.error.error, 'error'); // แสดงข้อความผิดพลาดจากแบ็กเอ็นด์
      console.error('บันทึกล้มเหลว:', error);
    }
  );
  }

  // Toggle menu function (optional based on your code)
  myFunction(x: EventTarget | null): void {
    const hamMenu = document.querySelector('.ham-menu div');
    if (hamMenu) {
      hamMenu.classList.toggle("change");
    }
    let myMenu = document.getElementById('myMenu');
    if (myMenu) {
      if (myMenu.className === 'navbar-item') {
        myMenu.className += ' menu-active';
      } else {
        myMenu.className = 'navbar-item';
      }
    }
  }
}
