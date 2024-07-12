import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/service/data.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ThaiDatePipe } from 'src/app/model/thai-date.service'; // import ไฟล์ pipe ที่สร้างมา
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-selections',
  templateUrl: './selections.component.html',
  styleUrls: ['./selections.component.scss'],
  providers: [DatePipe, ThaiDatePipe],
})
export class SelectionsComponent implements OnInit {
  selection: any[] = [];
  member_id: any;
  firstname: any;
  lastname: any;
  p: number = 1;  // For pagination, current page number

  constructor(
    private http: HttpClient,
    private dataService: DataService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.member_id = sessionStorage.getItem('member_id') || '';
    this.firstname = sessionStorage.getItem('firstname') || '';
    this.lastname = sessionStorage.getItem('lastname') || '';

    if (!this.member_id) {
      this.router.navigate(['/login']);
      return;
    }

    this.http
      .get(`${this.dataService.apiEndpoint}/selections/${this.member_id}`)
      .subscribe((data: any) => {
        this.selection = data;
        console.log(this.selection);
      });
  }

  delete_order_set(order_id: number, selection: any) {
    if (!selection || !selection.order_id) {
      console.error('Invalid selections data');
      return;
    }
  
    Swal.fire({
      title: 'ยกเลิกรายการใช่หรือไม่?',
      text: 'คุณต้องการยกเลิกรายการใช่หรือไม่?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ใช่, ยกเลิกรายการ!',
      cancelButtonText: 'ไม่',
      cancelButtonColor: '#d33',
      confirmButtonColor: '#006eff'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http
          .delete(`${this.dataService.apiEndpoint}/order_delete_auto/${order_id}`)
          .subscribe(
            () => {
              this.selection = this.selection.filter(
                (item) => item.order_id !== order_id
              );
  
              const updatedCount =
                selection.equipmentlist_count + selection.order_count;
  
              const updatedCountData = { count: updatedCount };
  
              this.http
                .put(
                  `${this.dataService.apiEndpoint}/order_selections_update_count/${selection.equipmentlist_id}`,
                  updatedCountData
                )
                .subscribe(
                  (response: any) => {
                    console.log('Borrow count updated successfully:', response);
                    this.deleteSelection(selection.borrowing_returning_id);
                  },
                  (error) => {
                    console.error('Failed to update borrow count:', error);
                  }
                );
            },
            (error) => {
              console.error('Error deleting selection:', error);
            }
          );
      }
    });
  }

  deleteSelection(borrowing_returning_id: number) {
    this.http
      .delete(
        `${this.dataService.apiEndpoint}/cancel_borrowing_returning/${borrowing_returning_id}`
      )
      .subscribe(
        () => {
          console.log('Selection deleted successfully');
        },
        (error) => {
          console.error('Error deleting selection:', error);
        }
      );
  }
  

  navigateToOrderAll() {
    this.router.navigate(['/orderall'], {
      queryParams: { member_id: this.member_id },
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
