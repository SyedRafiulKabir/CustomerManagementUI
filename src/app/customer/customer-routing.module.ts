import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerComponent } from './customer/customer.component';
import { ReportComponent } from './report/report.component';

const routes: Routes = [
    { path: '', component: CustomerComponent },
    { path: 'report', component: ReportComponent } 
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CustomerRoutingModule { }
