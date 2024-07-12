import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from 'src/app/service/data.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-borrowingreport',
  templateUrl: './borrowingreport.component.html',
  styleUrls: ['./borrowingreport.component.scss'],
})
export class BorrowingreportComponent implements OnInit {
  orderselections: any[] = [];
  filteredOrderSelections: any[] = [];
  admin_id: string = '';
  firstname: string = '';
  lastname: string = '';
  selectedDay: string = '';
  selectedMonth: string = '';
  selectedYear: string = '';
  member_id: string = '';
  p: number = 1;
  days = Array.from({ length: 31 }, (_, i) => i + 1);
  months = [
    { value: 1, name: 'มกราคม' },
    { value: 2, name: 'กุมภาพันธ์' },
    { value: 3, name: 'มีนาคม' },
    { value: 4, name: 'เมษายน' },
    { value: 5, name: 'พฤษภาคม' },
    { value: 6, name: 'มิถุนายน' },
    { value: 7, name: 'กรกฎาคม' },
    { value: 8, name: 'สิงหาคม' },
    { value: 9, name: 'กันยายน' },
    { value: 10, name: 'ตุลาคม' },
    { value: 11, name: 'พฤศจิกายน' },
    { value: 12, name: 'ธันวาคม' }
  ];
  currentYear = new Date().getFullYear();
  years = Array.from({ length: this.currentYear - 1999 }, (_, i) => i + 2000 + 543);

  constructor(
    private http: HttpClient,
    private dataService: DataService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.fetchOrderSelections();
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

  fetchOrderSelections() {
    this.http
      .get(`${this.dataService.apiEndpoint}/order_selections`)
      .subscribe((data: any) => {
        this.orderselections = data;
        this.filteredOrderSelections = data;
        console.log(this.orderselections);
      });
  }

  get filteredreportpage() {
    return this.orderselections.filter(sel => sel.borrowing_returning_status === '' || sel.borrowing_returning_status === 'N' || sel.borrowing_returning_status === 'Y');
  }

  filterByDate() {
    const selectedDate = {
      day: this.selectedDay,
      month: this.selectedMonth,
      year: this.selectedYear ? +this.selectedYear - 543 : ''
    };

    this.filteredOrderSelections = this.orderselections.filter((order) => {
      const borrowingDate = new Date(order.date_borrowing);
      return (
        (!selectedDate.day || borrowingDate.getDate() == +selectedDate.day) &&
        (!selectedDate.month || borrowingDate.getMonth() + 1 == +selectedDate.month) &&
        (!selectedDate.year || borrowingDate.getFullYear() == +selectedDate.year)
      );
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
