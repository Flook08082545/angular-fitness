import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FitnessitemComponent } from './page/fitnessitem/fitnessitem.component';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectionsComponent } from './selections/selections/selections.component';
import { MemberComponent } from './member/member/member.component';
import { BorrowedItemsComponent } from './borrowed_items/borrowed-items/borrowed-items.component';
import { SportsEquipmentComponent } from './sports_equipment/sports-equipment/sports-equipment.component';
import { AdminComponent } from './admin/admin/admin.component';
import { BorrowingreportComponent } from './borrowingreport/borrowingreport/borrowingreport.component';
import { BorrowedEquipmentreportComponent } from './borrowedEquipmentreport/borrowed-equipmentreport/borrowed-equipmentreport.component';
import { AddSportEquipmentComponent } from './add_sport_equipment/add-sport-equipment/add-sport-equipment.component';
import { EditSportEquipmentComponent } from './edit_sport_equipment/edit-sport-equipment/edit-sport-equipment.component';
import { QrcodeComponent } from './qrcode/qrcode/qrcode.component';
import { ProfileComponent } from './profile/profile/profile.component';
import { EditProfileComponent } from './edit_profile/edit-profile/edit-profile.component';
import { ReturningItemComponent } from './returning_item/returning-item/returning-item.component';
import { RegisterComponent } from './register/register/register.component';
import { VerificationEmailComponent } from './verification_email/verification-email/verification-email.component';
import { VerificationCodeComponent } from './verification_code/verification-code/verification-code.component';
import { AddAdminComponent } from './add_admin/add-admin/add-admin.component';
import { LoginAdminComponent } from './login_admin/login-admin/login-admin.component';
import { OrderShowComponent } from './order_show/order-show/order-show.component';
import { ThaiDatePipe } from './model/thai-date.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatDialogModule } from '@angular/material/dialog';
import { BorrowDialogComponent } from './borrow_dialog/borrow-dialog/borrow-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    FitnessitemComponent,
    LoginComponent,
    SelectionsComponent,
    MemberComponent,
    BorrowedItemsComponent,
    SportsEquipmentComponent,
    AdminComponent,
    BorrowingreportComponent,
    BorrowedEquipmentreportComponent,
    AddSportEquipmentComponent,
    EditSportEquipmentComponent,
    QrcodeComponent,
    ProfileComponent,
    EditProfileComponent,
    ReturningItemComponent,
    RegisterComponent,
    VerificationEmailComponent,
    VerificationCodeComponent,
    AddAdminComponent,
    LoginAdminComponent,
    OrderShowComponent,
    ThaiDatePipe,
    BorrowDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    MatDialogModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
