import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Convert as adminCvt, Admin } from 'src/app/model/admin.service';
import { DataService } from 'src/app/service/data.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent {
  admins: Admin[] = [];
  searchTerm: string = '';
  admin_id: string = '';
  firstname: string = '';
  lastname: string = '';
  member_id: string = '';
  p: number = 1;

  constructor(
    private http: HttpClient,
    private dataService: DataService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.admin_id = sessionStorage.getItem('admin_id') || '';
    this.firstname = sessionStorage.getItem('firstname') || '';
    this.lastname = sessionStorage.getItem('lastname') || '';
    this.member_id = sessionStorage.getItem('member_id') || '';

    this.fetchUserMembers();
    
    // Redirect to login if admin_id is not found
    if (!this.admin_id) {
      this.router.navigate(['/login_admin']);
      return;  // Stop further execution if not logged in
    }
  }

  fetchUserMembers() {
    this.http
      .get(this.dataService.apiEndpoint + '/admin_show')
      .subscribe((data: any) => {
        this.admins = adminCvt.toAdmin(JSON.stringify(data));
        console.log(this.admins);
      });
  }

  confirmApproval(admin_id: any) {
    const selectedOrder = this.admins.find(
      (admin) => admin['admin_id'] === admin_id
    );
    this.http
      .put(
        this.dataService.apiEndpoint + '/admin_suspended/' + admin_id,
        selectedOrder
      )
      .subscribe(
        (response) => {
          console.log('Success: ', response);
        },
        (error) => {
          console.error('Error: ', error);
        }
      );
  }

  addadmin() {
    const admin_id = sessionStorage.getItem('admin_id') || '';
    const firstname = sessionStorage.getItem('firstname') || '';
    const lastname = sessionStorage.getItem('lastname') || '';
    const member_id = sessionStorage.getItem('member_id') || '';
    this.router.navigate(['/addadmin'], {
      state: {
        admin_id: admin_id,
        firstname: firstname,
        lastname: lastname,
        member_id: member_id
      },
    });
  }

  searchItems() {
    if (this.searchTerm.trim() === '') {
      // ถ้าคำค้นหาว่างเปล่า โชว์ทั้งหมด
      this.fetchUserMembers();
    } else {
      // ค้นหาตามคำค้นหา
      const searchTerm = this.searchTerm.toLowerCase().trim();
      this.admins = this.admins.filter((admin) => {
        return (
          admin['firstname'].toLowerCase().includes(searchTerm) ||
          admin['lastname'].toLowerCase().includes(searchTerm)
        );
      });
    }
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
