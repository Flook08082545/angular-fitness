import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'; // เพิ่ม ActivatedRoute เข้ามาใช้งาน
import { DataService } from 'src/app/service/data.service';
import Swal from 'sweetalert2';
import { Convert as memberCvt, Member } from 'src/app/model/member.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
})
export class EditProfileComponent {
  member: Member[] = [];
  member_id: any;
  firstname: any;
  lastname: any;
  constructor(
    private dataService: DataService,
    private http: HttpClient,
    private router: Router,
  ) {}

  ngOnInit() {
    this.member_id = sessionStorage.getItem('member_id') || '';
    this.firstname = sessionStorage.getItem('firstname') || '';
    this.lastname = sessionStorage.getItem('lastname') || '';

    this.http
      .get(`${this.dataService.apiEndpoint}/member_pofile/${this.member_id}`)
      .subscribe(
        (response: any) => {
          this.member = memberCvt.toMember(JSON.stringify(response));
          console.log(this.member);
        },
        (error) => {
          console.error('Borrow failed:', error);
        }
      );

          // Redirect to login if member_id is not found
    if (!this.member_id) {
      this.router.navigate(['/login']);
      return;  // Stop further execution if not logged in
    }
  }

  save_member(
    member_id: any,
    prefix:any,
    firstname: any,
    lastname: any,
    email: any,
    sex: any,
    telephone_number: any
  ) {

    const updatedmember = {
      member_id: member_id,
      prefix: prefix,
      firstname: firstname,
      lastname: lastname,
      email: email,
      sex: sex,
      telephone_number: telephone_number,
    };
    console.log(updatedmember);
    this.http
      .put(
        `${this.dataService.apiEndpoint}/edit_member/${member_id}`,
        updatedmember
      )
      .subscribe(
        (response: any) => {
          Swal.fire('สำเร็จ', 'แก้ไขข้อมูลเรียบร้อย', 'success').then(() => {
            // เมื่ออัปเดตข้อมูลเสร็จสมบูรณ์ ทำการ redirect ไปยังหน้า profile พร้อมส่ง member_id ไปด้วย
            this.router.navigate(['/profile'],{
              state: {
                member_id: member_id
              }
            });
          });
        },
        (error) => {
          Swal.fire('สำเร็จ', 'แก้ไขข้อมูลเรียบร้อย', 'success').then(() => {
            // เมื่ออัปเดตข้อมูลเสร็จสมบูรณ์ ทำการ redirect ไปยังหน้า profile พร้อมส่ง member_id ไปด้วย
            this.router.navigate(['/profile'],{
              state: {
                member_id: member_id
              }
            });
          });
        }
      );
  }
  logout() {
    sessionStorage.clear();
    this.router.navigate(['/']);
  }
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
