import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/service/data.service';
import Swal from 'sweetalert2';
import { Convert as memberCvt, Member } from 'src/app/model/member.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  members: Member[] = [];

  constructor(
    private dataService: DataService,
    private http: HttpClient,
    private router: Router
  ) {
    this.http
      .get(this.dataService.apiEndpoint + '/member_show')
      .subscribe((data: any) => {
        this.members = memberCvt.toMember(JSON.stringify(data));
        console.log(this.members);
      });
  }

  save_register(
    prefix: string,
    firstname: string,
    lastname: string,
    email: string,
    password: string,
    sex: string,
    telephone: string) {

    if (!prefix || !firstname || !lastname || !email || !password || !sex || !telephone) {
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด!',
        text: 'กรุณากรอกข้อมูลให้ครบถ้วน',
      });
      return;
    }

    // if (!/^\d+$/.test(telephone)) {
    //   Swal.fire({
    //     icon: 'error',
    //     title: 'เกิดข้อผิดพลาด!',
    //     text: 'เบอร์โทรศัพท์ใส่แค่ตัวเลขเท่านั้น',
    //   });
    //   return;
    // }

    // Check if email exists in the fetched members
    const emailExists = this.members.some(member => member.email === email);

    if (emailExists) {
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด!',
        text: 'อีเมลนี้ถูกใช้ไปแล้ว',
      });
      return;
    }

    const save_register = {
      prefix: prefix,
      firstname: firstname,
      lastname: lastname,
      email: email,
      password: password,
      sex: sex,
      telephone_number: telephone,
      member_status: "N",
    };

    console.log(save_register);

    // Store data in sessionStorage
    sessionStorage.setItem('registerData', JSON.stringify(save_register));

    // Navigate to verification_email page
    this.router.navigate(['/verification_email']);
  }
}
