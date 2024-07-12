import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DataService } from 'src/app/service/data.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-returning-item',
  templateUrl: './returning-item.component.html',
  styleUrls: ['./returning-item.component.scss'],
})
export class ReturningItemComponent implements OnInit {
  orderreturn: any[] = [];
  filteredOrders: any[] = [];
  searchTerm: string = '';
  admin_id: string = '';
  firstname: string = '';
  lastname: string = '';
  member_id: string = ''; // Member ID
  p: number = 1;

  constructor(
    private http: HttpClient,
    private dataService: DataService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    // Retrieve session storage items
    this.admin_id = sessionStorage.getItem('admin_id') || '';
    this.firstname = sessionStorage.getItem('firstname') || '';
    this.lastname = sessionStorage.getItem('lastname') || '';
    this.member_id = sessionStorage.getItem('member_id') || '';

    // Fetch data with member_id if available
    if (this.member_id) {
      this.fetchDataWithMemberId();
    } else {
      // Fetch data without member_id if it's not available
      this.fetchData();
    }
  }

  fetchData() {
    this.http
      .get(this.dataService.apiEndpoint + '/order_borrowing_returning')
      .subscribe((data: any) => {
        this.orderreturn = data;
        this.filteredOrders = data;
      });
  }

  fetchDataWithMemberId() {
    this.http
      .get(`${this.dataService.apiEndpoint}/order_borrowing_returning?member_id=${this.member_id}`)
      .subscribe((data: any) => {
        this.orderreturn = data;
        this.filteredOrders = data;
      });
  }

  get filteredOrderspage() {
    return this.filteredOrders.filter(sel => sel.borrowing_returning_status === 'N' || sel.borrowing_returning_status === 'Y');
  }

  confirmApproval(borrowing_returning_id: number, orderreturn: any) {
    Swal.fire({
      title: 'ต้องการคืนอุปกรณ์ใช่หรือไม่?',
      text: "คุณต้องการคืนอุปกรณ์ใช่มั้ย!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ตกลง, ยืนยันการคืน!',
      cancelButtonText: 'ยกเลิก',
    }).then((result) => {
      if (result.isConfirmed) {
        const selectedOrder = this.orderreturn.find(
          (order) => order.borrowing_returning_id === borrowing_returning_id
        );
        const order_count = {
          order_count: orderreturn.equipmentlist_count + orderreturn.order_count,
        };

        if (selectedOrder && selectedOrder.borrowing_returning_status === 'N') {
          const currentDate = new Date();
          currentDate.setHours(currentDate.getHours() + 7);  // เพิ่มชั่วโมงตามเวลาท้องถิ่นประเทศไทย
          const formattedDate = currentDate.toISOString().split('T')[0];
          const order_return = {
            formattedDate: formattedDate,
            selectedOrder_return: selectedOrder.borrowing_returning_status = 'Y'
          };

          this.http
            .put(
              this.dataService.apiEndpoint +
                '/order_return_update/' +
                borrowing_returning_id,
              order_return
            )
            .subscribe(
              (response) => {
                console.log('Approval successful:', response);

                this.http
                  .put(
                    this.dataService.apiEndpoint +
                      '/order_return_update_count/' +
                      orderreturn.equipmentlist_id,
                    order_count
                  )
                  .subscribe(
                    (response) => {
                      console.log('Success:', response);
                      this.resetView(); // Reset the view after successful update
                      Swal.fire(
                        'คืนอุปกรณ์เรียบร้อยแล้ว!',
                        'คืนรายการอุปกรณ์เรียบร้อยแล้ว',
                        'success'
                      );
                    },
                    (error) => {
                      console.error('Error:', error);
                      Swal.fire(
                        'Error!',
                        'There was an error approving the return.',
                        'error'
                      );
                    }
                  );
              },
              (error) => {
                console.error('Error:', error);
                Swal.fire(
                  'Error!',
                  'There was an error approving the return.',
                  'error'
                );
              }
            );
        }
      }
    });
  }

  resetView() {
    this.searchTerm = '';
    if (this.member_id) {
      this.fetchDataWithMemberId();
    } else {
      this.fetchData();
    }
  }

  searchItems() {
    if (this.searchTerm.trim() !== '') {
      this.filteredOrders = this.orderreturn.filter((order) =>
        order.firstname.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        order.lastname.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        order.equipmentlist_name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredOrders = this.orderreturn;
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
