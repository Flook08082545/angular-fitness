import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { DataService } from 'src/app/service/data.service';
import { Convert as memberCvt, Member } from 'src/app/model/member.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.scss'],
})
export class MemberComponent {
  members: Member[] = [];
  filteredMembers: Member[] = [];
  searchTerm: string = '';
  admin_id: string = '';
  firstname: string = '';
  lastname: string = '';
  member_id: string = '';
  p: number = 1;

  constructor(
    private http: HttpClient,
    private dataService: DataService,
    private router: Router,
  ) {
    this.fetchUserMembers();

    this.admin_id = sessionStorage.getItem('admin_id') || '';
    this.firstname = sessionStorage.getItem('firstname') || '';
    this.lastname = sessionStorage.getItem('lastname') || '';
    this.member_id = sessionStorage.getItem('member_id') || '';

                    // Redirect to login if member_id is not found
                    if (!this.admin_id) {
                      this.router.navigate(['/login_admin']);
                      return;  // Stop further execution if not logged in
                    }
  }

  fetchUserMembers() {
    this.http
      .get(this.dataService.apiEndpoint + '/member_show')
      .subscribe((data: any) => {
        this.members = memberCvt.toMember(JSON.stringify(data));
        this.filteredMembers = this.members; // initialize filteredMembers with all members
        console.log(this.members);
      });
  }

  confirmApproval(member_id: any) {
    const selectedMember = this.members.find(
      (member) => member.member_id === member_id
    );
    if (selectedMember && selectedMember.member_status === 'N') {
      selectedMember.member_status = 'Y';
      this.http
        .put(
          this.dataService.apiEndpoint + '/member_suspended/' + member_id,
          selectedMember
        )
        .subscribe(
          (response) => {
            console.log('สำเร็จ: ', response);
          },
          (error) => {
            console.error('เกิดข้อผิดพลาด: ', error);
          }
        );
    }else if(selectedMember && selectedMember.member_status === 'Y'){
      selectedMember.member_status = 'N';
      this.http
        .put(
          this.dataService.apiEndpoint + '/member_suspended/' + member_id,
          selectedMember
        )
        .subscribe(
          (response) => {
            console.log('สำเร็จ: ', response);
          },
          (error) => {
            console.error('เกิดข้อผิดพลาด: ', error);
          }
        );
    }
  }

  searchMembers() {
    if (this.searchTerm.trim() !== '') {
      // If search term is not empty
      this.filteredMembers = this.members.filter((member) =>
        // Filter members array based on whether firstname or lastname includes the search term
        member.firstname.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        member.lastname.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      // If search term is empty, show all members
      this.filteredMembers = this.members;
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
