import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/service/data.service';
import Swal from 'sweetalert2';
import {
  Convert as memberCvt,
  Member,
} from 'src/app/model/member.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  member: Member[] = [];
  member_id: any;
  firstname: any;
  lastname: any;
  constructor(
    private dataService: DataService,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute // เพิ่ม ActivatedRoute เข้ามาใช้งาน
  ) {
  }
  ngOnInit() {
    this.member_id = sessionStorage.getItem('member_id') || '';
    this.firstname = sessionStorage.getItem('firstname') || '';
    this.lastname = sessionStorage.getItem('lastname') || '';
  
    this.http
  .get(
    `${this.dataService.apiEndpoint}/member_pofile/${this.member_id}`
  )
  .subscribe(
    (response: any) => {
      this.member = memberCvt.toMember(
        JSON.stringify(response)
      );
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
  goToEditProfile() {
    this.member_id = sessionStorage.getItem('member_id') || '';
    this.firstname = sessionStorage.getItem('firstname') || '';
    this.lastname = sessionStorage.getItem('lastname') || '';

     this.router.navigate(['/editprofile'],{
      state: {
        member_id: this.member_id,
        firstname: this.firstname,
        lastname: this.lastname
      }
    });
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
