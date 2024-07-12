import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DataService } from 'src/app/service/data.service';

@Component({
  selector: 'app-borrowed-equipmentreport',
  templateUrl: './borrowed-equipmentreport.component.html',
  styleUrls: ['./borrowed-equipmentreport.component.scss'],
})
export class BorrowedEquipmentreportComponent implements OnInit {
  orderselections: any[] = [];
  filteredOrderSelections: any[] = [];
  admin_id: string = '';
  firstname: string = '';
  lastname: string = '';
  member_id: string = '';
  p: number = 1;
  selectedDay: string = '';
  selectedMonth: string = '';
  selectedYear: string = '';

  days: number[] = Array.from({ length: 31 }, (_, i) => i + 1);
  months: { name: string, value: number }[] = [
    { name: 'มกราคม', value: 1 },
    { name: 'กุมภาพันธ์', value: 2 },
    { name: 'มีนาคม', value: 3 },
    { name: 'เมษายน', value: 4 },
    { name: 'พฤษภาคม', value: 5 },
    { name: 'มิถุนายน', value: 6 },
    { name: 'กรกฎาคม', value: 7 },
    { name: 'สิงหาคม', value: 8 },
    { name: 'กันยายน', value: 9 },
    { name: 'ตุลาคม', value: 10 },
    { name: 'พฤศจิกายน', value: 11 },
    { name: 'ธันวาคม', value: 12 },
  ];
  currentYear = new Date().getFullYear();
  years = Array.from({ length: this.currentYear - 1999 }, (_, i) => i + 2000 + 543);

  constructor(
    private http: HttpClient,
    private dataService: DataService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.fetchBorrowedEquipmentReport();
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

  fetchBorrowedEquipmentReport() {
    this.http
      .get(`${this.dataService.apiEndpoint}/borrowedequipmentreport`)
      .subscribe((data: any) => {
        this.orderselections = data;
        this.filteredOrderSelections = data;
        console.log(this.orderselections);
      });
  }
  get filteredequipmentreportpage() {
    return this.orderselections.filter(sel => sel.borrowing_returning_status === '' || sel.borrowing_returning_status === 'N' || sel.borrowing_returning_status === 'Y');
  }

  search() {
    this.filteredOrderSelections = this.orderselections.filter((order) => {
      const orderDate = new Date(order.date_borrowing);
      return (
        (!this.selectedDay || orderDate.getDate() === +this.selectedDay) &&
        (!this.selectedMonth || orderDate.getMonth() + 1 === +this.selectedMonth) &&
        (!this.selectedYear || orderDate.getFullYear() === +this.selectedYear)
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
