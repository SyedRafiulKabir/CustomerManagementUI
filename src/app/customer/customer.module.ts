import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerRoutingModule } from './customer-routing.module';
import { CustomerComponent } from './customer/customer.component';
import { CustomerFormComponent } from './customer-form/customer-form.component';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { CustomerService } from '../services/customer.service';
import { HttpClientModule } from '@angular/common/http';

import { GridModule } from '@progress/kendo-angular-grid';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReportComponent } from './report/report.component';


@NgModule({
    declarations: [
        CustomerComponent,
        CustomerFormComponent,
        CustomerListComponent,
        ReportComponent
    ],
    imports: [
        CommonModule,
        CustomerRoutingModule,
        HttpClientModule,
        GridModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatButtonModule,
        ReactiveFormsModule,
        FormsModule
         
    ],
    exports: [],
    providers: [CustomerService]
})
export class CustomerModule { }
