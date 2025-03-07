import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerRoutingModule } from './customer-routing.module';
import { CustomerFormComponent } from './customer-form/customer-form.component';


@NgModule({
    declarations: [
        CustomerFormComponent
    ],
    imports: [
        CommonModule,
        CustomerRoutingModule
    ]
})
export class CustomerModule { }
