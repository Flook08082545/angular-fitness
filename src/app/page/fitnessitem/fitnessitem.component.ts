import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DataService } from 'src/app/service/data.service';
import { BorrowDialogComponent } from 'src/app/borrow_dialog/borrow-dialog/borrow-dialog.component';
import { Equipmentlist, Convert as equipmentlistCvt } from 'src/app/model/fitness.service';

@Component({
  selector: 'app-fitnessitem',
  templateUrl: './fitnessitem.component.html',
  styleUrls: ['./fitnessitem.component.scss'],
})
export class FitnessitemComponent implements OnInit {
  equipmentLists: Equipmentlist[] = [];
  member_id: string = '';
  firstname: string = '';
  lastname: string = '';

  constructor(
    private http: HttpClient,
    private dataService: DataService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.member_id = sessionStorage.getItem('member_id') || '';
    this.firstname = sessionStorage.getItem('firstname') || '';
    this.lastname = sessionStorage.getItem('lastname') || '';

    if (!this.member_id) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadEquipmentList();
  }

  loadEquipmentList(): void {
    this.http
      .get(this.dataService.apiEndpoint + '/equipmentlist')
      .subscribe((data: any) => {
        this.equipmentLists = equipmentlistCvt.toEquipmentlist(
          JSON.stringify(data)
        );
      });
  }

  borrow(equipmentlist_id: any): void {
    const selectedEquipment = this.equipmentLists.find(item => item.equipmentlist_id === equipmentlist_id);
    const dialogRef = this.dialog.open(BorrowDialogComponent, {
      width: '400px',
      data: { equipment: selectedEquipment }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Process result here
        console.log('Dialog result:', result);
      }
    });
  }

  logout(): void {
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
