import { Component, OnInit } from '@angular/core';
import QRCode from 'qrcode';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-qrcode',
  templateUrl: './qrcode.component.html',
  styleUrls: ['./qrcode.component.scss'],
})
export class QrcodeComponent implements OnInit {
  qrCodeUrl: string = '';
  member_id: string = '';
  firstname: string = '';
  lastname: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.member_id = sessionStorage.getItem('member_id') || '';
    this.firstname = sessionStorage.getItem('firstname') || '';
    this.lastname = sessionStorage.getItem('lastname') || '';

    // Redirect to login if member_id is not found
    if (!this.member_id) {
      this.router.navigate(['/login']);
      return; // Stop further execution if not logged in
    }

    this.generateQRCode();
  }

  generateQRCode() {
    // Generate URL to login_admin page with member_id as query parameter
    const qrData = `${window.location.origin}/?member_id=${this.member_id}`;

    // Generate QR code from the URL
    QRCode.toDataURL(qrData, { errorCorrectionLevel: 'H' })
      .then((url) => {
        this.qrCodeUrl = url;
      })
      .catch((err) => {
        console.error(err);
      });
  }

  downloadQRCode() {
    const link = document.createElement('a');
    link.href = this.qrCodeUrl;
    link.download = 'QRCode.png';
    link.click();
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
