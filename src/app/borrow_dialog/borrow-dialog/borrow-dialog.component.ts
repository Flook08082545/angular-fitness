import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { DataService } from 'src/app/service/data.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-borrow-dialog',
  templateUrl: './borrow-dialog.component.html',
  styleUrls: ['./borrow-dialog.component.scss']
})
export class BorrowDialogComponent {
  equipment: any;
  count: number = 0;
  member_id: any;
  firstname: any;
  lastname: any;

  constructor(
    public dialogRef: MatDialogRef<BorrowDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient,
    private dataService: DataService,
    private router: Router,
  ) {
    this.equipment = data.equipment;
  }

  ngOnInit() {
    this.member_id = sessionStorage.getItem('member_id') || '';
    this.firstname = sessionStorage.getItem('firstname') || '';
    this.lastname = sessionStorage.getItem('lastname') || '';
  }

  decrementCounter() {
    if (this.count < this.equipment.equipmentlist_count) {
      this.count++;
    } else {
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด!',
        text: 'จำนวนอุปกรณ์ไม่เพียงพอ',
        showCancelButton: true,
        confirmButtonText: 'ตกลง',
      });
    }
  }

  incrementCounter() {
    if (this.count > 0) {
      this.count--;
    }
  }

  async order_confirm() {
    console.log('ยืนยันการยืมอุปกรณ์ ID:', this.equipment.equipmentlist_id);
  
    if (this.equipment.equipmentlist_count === 0 || this.count === 0) {
      Swal.fire({
        icon: 'error',
        title: 'ยังไม่เพิ่มอุปกรณ์!',
        text: 'ไม่สามารถยืมอุปกรณ์ได้',
        showCancelButton: true,
        confirmButtonText: 'ตกลง',
      });
      return;
    }
  
    try {
      const borrowResponse: any = await this.http
        .get(`${this.dataService.apiEndpoint}/borrowing_returning/${this.member_id}`)
        .toPromise();
  
      const pendingItems = borrowResponse.filter((item: any) => item.borrowing_returning_status !== 'Y').length;
  
      if (pendingItems >= 5) {
        Swal.fire({
          icon: 'error',
          title: 'ไม่สามารถยืมอุปกรณ์ได้',
          text: 'สามารถยืมอุปกรณ์ได้สูงสุด 5 รายการที่ยังไม่ส่งคืน',
          showCancelButton: true,
          confirmButtonText: 'ตกลง',
        });
        return;
      }
  
      function generateRandomString(length: number, withDigits: boolean): string {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const digits = '0123456789';
        let characters = letters;
        if (withDigits) {
          characters += digits;
        }
        let result = '';
        for (let i = 0; i < length; i++) {
          const randomIndex = Math.floor(Math.random() * characters.length);
          result += characters[randomIndex];
        }
        return result;
      }
  
      const updatedCount = this.equipment.equipmentlist_count - this.count;
      const Count = this.count;
      const currentDate = new Date();
      currentDate.setHours(currentDate.getHours() + 7);  // เพิ่มชั่วโมงตามเวลาท้องถิ่นประเทศไทย
      const formattedDate = currentDate.toISOString().split('T')[0];
      const randomLetter = generateRandomString(1, false);
      const randomDigits = generateRandomString(4, true);
      const borrowing_returning_id = randomLetter + randomDigits;
  
      const orderData = {
        borrowing_returning_id,
        order_date: formattedDate,
        borrowing_returning_status: '',
        member_id: this.member_id,
      };
  
      const response: any = await this.http
        .post(`${this.dataService.apiEndpoint}/borrowing`, orderData)
        .toPromise();
  
      Swal.fire({
        icon: 'success',
        title: 'ยืนยันการยืมเรียบร้อย',
        text: 'ยืนยันการยืมอุปกรณ์กีฬาเรียบร้อย',
        showCancelButton: false,
        confirmButtonText: 'ตกลง',
      }).then(async (result) => {
        const orderDetails = {
          equipmentlist_id: this.equipment.equipmentlist_id,
          borrowing_returning_id,
          count: Count,
        };
  
        const orderResponse: any = await this.http
          .post(`${this.dataService.apiEndpoint}/list_order`, orderDetails)
          .toPromise();
  
        this.updateBorrowCount(this.equipment.equipmentlist_id, updatedCount);
  
        // นำทางไปยังหน้าการเลือกพร้อมกับส่งพารามิเตอร์
        this.router.navigate(['/selections']);
  
        // ปิด dialog
        this.dialogRef.close();
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'ข้อผิดพลาด!',
        text: 'การยืนยันคำสั่งซื้อล้มเหลว',
        showCancelButton: true,
        confirmButtonText: 'ตกลง',
      }).then((result) => {
        if (result.isConfirmed) {
          console.error('การยืนยันคำสั่งซื้อล้มเหลว:', error);
        }
      });
    }
  }
  
  updateBorrowCount(equipmentlist_id: any, updatedCount: number) {
    const updateData = {
      equipmentlist_count: updatedCount,
    };

    this.http
      .put(
        `${this.dataService.apiEndpoint}/equipments_update_count/${equipmentlist_id}`,
        updateData
      )
      .subscribe(
        (response: any) => {
          console.log('อัพเดทจำนวนยืมสำเร็จ:', response);
        },
        (error) => {
          console.error('ล้มเหลวในการอัพเดทจำนวนยืม:', error);
        }
      );
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
