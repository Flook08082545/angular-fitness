import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Convert as equipmentlistCvt,
  Equipmentlist,
} from 'src/app/model/fitness.service';
import { DataService } from 'src/app/service/data.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sports-equipment',
  templateUrl: './sports-equipment.component.html',
  styleUrls: ['./sports-equipment.component.scss'],
})
export class SportsEquipmentComponent implements OnInit {
  equipmentlist: Equipmentlist[] = [];
  filteredEquipmentList: Equipmentlist[] = [];
  searchQuery: string = '';
  admin_id: string = '';
  firstname: string = '';
  lastname: string = '';
  member_id: string = ''; // Member ID
  p: number = 1;

  constructor(
    private http: HttpClient,
    private dataService: DataService,
    private router: Router,
    private route: ActivatedRoute
  ) {
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

  ngOnInit(): void {
    this.fetchEquipmentList();
  }

  fetchEquipmentList() {
    this.http
      .get(this.dataService.apiEndpoint + '/equipmentlist')
      .subscribe((data: any) => {
        this.equipmentlist = equipmentlistCvt.toEquipmentlist(
          JSON.stringify(data)
        );
        this.filteredEquipmentList = [...this.equipmentlist];
        this.searchEquipment();
      });
  }

  searchEquipment() {
    if (this.searchQuery.trim() !== '') {
      this.filteredEquipmentList = this.equipmentlist.filter((equipment) =>
        equipment.equipmentlist_name
          .toLowerCase()
          .includes(this.searchQuery.toLowerCase())
      );
    } else {
      this.filteredEquipmentList = [...this.equipmentlist];
    }
  }

  editsportequipment(equipmentlist_id: any) {
    const admin_id = sessionStorage.getItem('admin_id') || '';
    const firstname = sessionStorage.getItem('firstname') || '';
    const lastname = sessionStorage.getItem('lastname') || '';
    const member_id = sessionStorage.getItem('member_id') || '';

    this.router.navigate(['/editSportEquipment', equipmentlist_id], {
      state: {
        admin_id: admin_id,
        firstname: firstname,
        lastname: lastname,
        member_id: member_id
      },
    });
  }

  fetchselectionItems() {
    this.fetchEquipmentList();
  }

  deletesportequipment(equipmentlist_id: any) {
    Swal.fire({
      title: 'คุณแน่ใจหรือไม่?',
      text: 'คุณต้องการลบข้อมูลนี้?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ใช่, ลบ!',
      cancelButtonText: 'ยกเลิก',
    }).then((result) => {
      if (result.isConfirmed) {
        this.http
          .delete(`${this.dataService.apiEndpoint}/equipmentlist_delete/${equipmentlist_id}`)
          .subscribe(() => {
            Swal.fire('Deleted!', 'ลบข้อมูลสำเร็จ', 'success');
            this.fetchEquipmentList(); // รีเฟรชรายการอุปกรณ์หลังจากการลบข้อมูล
          }, (error) => {
            Swal.fire('Error!', 'เกิดข้อผิดพลาดในการลบข้อมูล', 'error');
            console.error('Delete failed:', error);
          });
      }
    });
  }

  addSportEquipment() {
    const admin_id = sessionStorage.getItem('admin_id') || '';
    const firstname = sessionStorage.getItem('firstname') || '';
    const lastname = sessionStorage.getItem('lastname') || '';
    const member_id = sessionStorage.getItem('member_id') || '';
    this.router.navigate(['/addSportEquipment'], {
      state: {
        admin_id: admin_id,
        firstname: firstname,
        lastname: lastname,
        member_id: member_id
      },
    });
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
