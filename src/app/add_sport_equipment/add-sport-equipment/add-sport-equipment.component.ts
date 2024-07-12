import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { DataService } from 'src/app/service/data.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-sport-equipment',
  templateUrl: './add-sport-equipment.component.html',
  styleUrls: ['./add-sport-equipment.component.scss'],
})
export class AddSportEquipmentComponent {
  equipmentlist_old_id: any;
  equipmentlist_name: any;
  equipmentlist_count: any;
  equipmentlist_unit: any;
  equipmentlist_detail: any;
  picture: File | null = null;
  admin_id: string;
  firstname: string;
  lastname: string;
  member_id: string;

  constructor(
    private dataService: DataService,
    private http: HttpClient,
    private router: Router,
  ) {
    this.admin_id = sessionStorage.getItem('admin_id') || '';
    this.firstname = sessionStorage.getItem('firstname') || '';
    this.lastname = sessionStorage.getItem('lastname') || '';
    this.member_id = sessionStorage.getItem('member_id') || '';

                        if (!this.admin_id) {
                          this.router.navigate(['/login_admin']);
                          return;
                        }
  }

  ngOnInit() {
    this.generateDeviceCode();
  }

  generateDeviceCode() {
    const randomLetter = () => String.fromCharCode(65 + Math.floor(Math.random() * 26));
    const randomDigit = () => Math.floor(Math.random() * 10).toString();
    const randomBlock = (length: number) => Array.from({ length }, randomDigit).join('');
    const randomBlockWithLetter = (length: number) => randomLetter() + randomBlock(length - 1);

    const part1 = `2-${randomBlockWithLetter(5)}`;
    const part2 = randomBlockWithLetter(4);
    const part3 = randomBlock(9);
    const part4 = `/${randomBlock(3)}-65`;

    this.equipmentlist_old_id = `${part1}-${part2}-${part3}${part4}`;
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.picture = file;
    }
    console.log(file);
  }

  save_equipment(equipmentlist_name: any, equipmentlist_count: any, equipmentlist_unit: any, equipmentlist_detail: any) {
    // Validate that equipmentlist_count is a number
    if (!/^\d+$/.test(equipmentlist_count)) {
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด!',
        text: 'กรุณาใส่แค่ตัวเลขเท่านั้นสำหรับจำนวน',
      });
      return;
    }

    if (!this.picture) {
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด!',
        text: 'กรุณาอัปโหลดรูปภาพ',
      });
      return;
    }

    const formData = new FormData();
    formData.append('admin_id', this.admin_id);
    formData.append('equipmentlist_name', equipmentlist_name);
    formData.append('equipmentlist_count', equipmentlist_count);
    formData.append('equipmentlist_unit', equipmentlist_unit);
    formData.append('equipmentlist_detail', equipmentlist_detail);
    formData.append('picture', this.picture);
    formData.append('equipmentlist_old_id', this.equipmentlist_old_id);

    console.log(formData);

    this.http.post(`${this.dataService.apiEndpoint}/add_equipment`, formData).subscribe(
      (response) => {
        console.log('บันทึกข้อมูลอุปกรณ์กีฬาเรียบร้อย:', response);
        Swal.fire({
          icon: 'success',
          title: 'สำเร็จ!',
          text: 'บันทึกข้อมูลอุปกรณ์กีฬาเรียบร้อยแล้ว',
          showCancelButton: true,
          confirmButtonText: 'ตกลง',
        }).then((result) => {
          if (result.isConfirmed) {
            this.navigateToSportsequipment();
          }
        });
      },
      (error) => {
        console.error('เกิดข้อผิดพลาดในการบันทึกข้อมูลอุปกรณ์กีฬา:', error);
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด!',
          text: 'การบันทึกข้อมูลอุปกรณ์กีฬาล้มเหลว',
          showCancelButton: true,
          confirmButtonText: 'ตกลง',
        });
      }
    );
  }

  navigateToSportsequipment() {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        adminId: this.admin_id,
      },
    };

    this.router.navigate(['/sportsequipment'], navigationExtras);
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
