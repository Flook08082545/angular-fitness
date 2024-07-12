import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/service/data.service';
import Swal from 'sweetalert2';
import { Convert as equipmentlistCvt, Equipmentlist } from 'src/app/model/fitness.service';

@Component({
  selector: 'app-edit-sport-equipment',
  templateUrl: './edit-sport-equipment.component.html',
  styleUrls: ['./edit-sport-equipment.component.scss'],
})
export class EditSportEquipmentComponent implements OnInit {
  equipmentLists: Equipmentlist[] = [];
  equipmentlist_id: string = '';
  equipmentlist_name: string = '';
  equipmentlist_count: number | null = null;
  equipmentlist_unit: string = '';
  equipmentlist_detail: string = '';
  picture: File | null = null;
  existingPicture: string | null = null;
  admin_id: string = '';
  firstname: string = '';
  lastname: string = '';
  member_id: string = '';

  constructor(
    private dataService: DataService,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.admin_id = sessionStorage.getItem('admin_id') || '';
    this.firstname = sessionStorage.getItem('firstname') || '';
    this.lastname = sessionStorage.getItem('lastname') || '';
    this.member_id = sessionStorage.getItem('member_id') || '';

    this.route.params.subscribe((params) => {
      this.equipmentlist_id = params['equipmentlist_id'];
      this.fetchEquipmentDetails();
    });

    if (!this.admin_id) {
      this.router.navigate(['/login_admin']);
    }
  }

  fetchEquipmentDetails() {
    this.http
      .get(`${this.dataService.apiEndpoint}/edit_equipment/${this.equipmentlist_id}`)
      .subscribe(
        (response: any) => {
          this.equipmentLists = equipmentlistCvt.toEquipmentlist(JSON.stringify(response));
          if (this.equipmentLists.length > 0) {
            const equipment = this.equipmentLists[0];
            this.equipmentlist_name = equipment.equipmentlist_name;
            this.equipmentlist_count = equipment.equipmentlist_count;
            this.equipmentlist_unit = equipment.equipmentlist_unit;
            this.equipmentlist_detail = equipment.equipmentlist_detail;
            this.existingPicture = equipment.equipmentlist_picture;
          }
        },
        (error) => {
          console.error('Fetch failed:', error);
        }
      );
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.picture = file;
    }
  }

  update_equipment() {
    if (!this.equipmentlist_name || !this.equipmentlist_count || !this.equipmentlist_unit || !this.equipmentlist_detail) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Please fill in all fields',
      });
      return;
    }

    if (isNaN(this.equipmentlist_count)) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Count must be a number',
      });
      return;
    }

    const formData = new FormData();
    formData.append('equipmentlist_name', this.equipmentlist_name);
    formData.append('equipmentlist_count', this.equipmentlist_count.toString());
    formData.append('equipmentlist_unit', this.equipmentlist_unit);
    formData.append('equipmentlist_detail', this.equipmentlist_detail);

    if (this.picture) {
      formData.append('picture', this.picture);
    } else if (this.existingPicture) {
      formData.append('picture', this.existingPicture);
    }

    this.http.put(`${this.dataService.apiEndpoint}/update_equipment/${this.equipmentlist_id}`, formData)
      .subscribe(
        (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Equipment updated successfully',
            showCancelButton: true,
            confirmButtonText: 'OK',
          });
          this.router.navigate(['/sportsequipment']);
        },
        (error) => {
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Equipment updated successfully',
            showCancelButton: true,
            confirmButtonText: 'OK',
          });
          this.router.navigate(['/sportsequipment']);
        }
      );
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
