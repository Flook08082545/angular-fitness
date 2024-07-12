import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//import { FitnessitemComponent } from './page/fitnessitem/fitnessitem.component';
import { LoginComponent } from './login/login/login.component';
import { FitnessitemComponent } from './page/fitnessitem/fitnessitem.component';
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
import { OrderShowComponent } from './order_show/order-show/order-show.component';
import { LoginAdminComponent } from './login_admin/login-admin/login-admin.component';

const routes: Routes = [
  { path: '', component: OrderShowComponent },
  { path: 'login', component: LoginComponent },
  { path: 'login_admin', component: LoginAdminComponent },
  { path: 'borroweditems', component: BorrowedItemsComponent },
  { path: 'selections', component: SelectionsComponent },
  { path: 'member', component: MemberComponent },
  { path: 'sportsequipment', component: SportsEquipmentComponent },
  { path: 'fitnessitem', component: FitnessitemComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'borrowingreport', component: BorrowingreportComponent },
  {
    path: 'borrowingequipmentreport',
    component: BorrowedEquipmentreportComponent,
  },
  { path: 'addSportEquipment', component: AddSportEquipmentComponent },
  {
    path: 'editSportEquipment/:equipmentlist_id',
    component: EditSportEquipmentComponent,
  },
  {
    path: 'qrcode',
    component: QrcodeComponent,
  },
  {
    path: 'profile',
    component: ProfileComponent,
  },
  {
    path: 'editprofile',
    component: EditProfileComponent,
  },
  {
    path: 'returnitem',
    component: ReturningItemComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'verification_email',
    component: VerificationEmailComponent,
  },
  {
    path: 'verification_code',
    component: VerificationCodeComponent,
  },
  {
    path: 'addadmin',
    component: AddAdminComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
