import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/service/data.service';
import { Convert as equipmentlistCvt, Equipmentlist } from 'src/app/model/fitness.service';

@Component({
  selector: 'app-order-show',
  templateUrl: './order-show.component.html',
  styleUrls: ['./order-show.component.scss']
})
export class OrderShowComponent implements OnInit {
  equipmentLists: Equipmentlist[] = [];
  memberId: string = '';

  constructor(
    private http: HttpClient,
    private dataService: DataService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.memberId = this.route.snapshot.queryParamMap.get('member_id') || sessionStorage.getItem('member_id') || '';
    if (this.memberId) {
      sessionStorage.setItem('member_id', this.memberId);
    }

    // Fetch the equipment list
    this.http
      .get(this.dataService.apiEndpoint + '/equipmentlist')
      .subscribe((data: any) => {
        this.equipmentLists = equipmentlistCvt.toEquipmentlist(JSON.stringify(data));
        console.log(this.equipmentLists);
      });
  }

  goToadmin() {
    sessionStorage.setItem('member_id', this.memberId);
    this.router.navigate(['/login_admin']);
  }

  goTomember() {
    this.router.navigate(['/login']);
  }
}
