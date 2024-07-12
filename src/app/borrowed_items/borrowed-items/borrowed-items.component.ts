// TypeScript component
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/service/data.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-borrowed-items',
  templateUrl: './borrowed-items.component.html',
  styleUrls: ['./borrowed-items.component.scss'],
})
export class BorrowedItemsComponent implements OnInit {
  orderselections: any[] = [];
  searchTerm: string = '';
  admin_id: string = '';
  firstname: string = '';
  lastname: string = '';
  member_id: string = ''; // Member ID
  p: number = 1;

  constructor(
    private http: HttpClient,
    private dataService: DataService,
    private router: Router,
  ) {}

  ngOnInit() {
    // Retrieve session storage items
    this.admin_id = sessionStorage.getItem('admin_id') || '';
    this.firstname = sessionStorage.getItem('firstname') || '';
    this.lastname = sessionStorage.getItem('lastname') || '';
    this.member_id = sessionStorage.getItem('member_id') || '';

    // Redirect to login if admin_id is not found
    if (!this.admin_id) {
      this.router.navigate(['/login_admin']);
      return;  // Stop further execution if not logged in
    }

    // Construct the endpoint URL based on the presence of member_id
    let endpointUrl = this.dataService.apiEndpoint + '/order_borrowing_returning';
    if (this.member_id) {
      endpointUrl += `?member_id=${this.member_id}`;
    }

    // Make the HTTP request to the constructed URL
    this.http.get(endpointUrl).subscribe(
      (data: any) => {
        this.orderselections = data;
      },
      (error) => {
        console.error('Error fetching order selections:', error);
      }
    );
  }

  get filteredOrderSelections() {
    return this.orderselections.filter(
      sel => sel.borrowing_returning_status === '' || sel.borrowing_returning_status === 'N'
    );
  }

  confirmApproval(borrowing_returning_id: number) {
    const selectedOrder = this.orderselections.find(
      (order) => order.borrowing_returning_id === borrowing_returning_id
    );
    
    if (selectedOrder && selectedOrder.borrowing_returning_status === '') {
      Swal.fire({
        title: 'ต้องการยืนยันใช่หรือไม่?',
        text: "คุณต้องการยืนยันใช่มั้ย!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'ตกลง, ยืนยันการยืม!',
        cancelButtonText: 'ยกเลิก',
      }).then((result) => {
        if (result.isConfirmed) {
          selectedOrder.borrowing_returning_status = 'N';
          this.http
            .put(
              this.dataService.apiEndpoint + '/order_selections_update/' + borrowing_returning_id,
              selectedOrder
            )
            .subscribe(
              (response) => {
                Swal.fire(
                  'ยืนยันเรียบร้อยแล้ว!',
                  'ยืนยันรายการเรียบร้อยแล้ว',
                  'success'
                );
              },
              (error) => {
                Swal.fire(
                  'Error!',
                  'There was an error approving the order.',
                  'error'
                );
                console.error('Error approving order:', error);
              }
            );
        }
      });
    }
  }
  

  searchItems() {
    if (this.searchTerm.trim() !== '') {
      this.orderselections = this.orderselections.filter((item) =>
        item.firstname.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.lastname.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.equipmentlist_name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.http.get(this.dataService.apiEndpoint + '/order_borrowing_returning').subscribe(
        (data: any) => {
          this.orderselections = data;
        },
        (error) => {
          console.error('Error fetching order selections:', error);
        }
      );
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
