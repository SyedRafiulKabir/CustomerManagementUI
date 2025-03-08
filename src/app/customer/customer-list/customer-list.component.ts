import { Component, OnInit, ViewChild } from '@angular/core';
import { Customer } from '../../models/customer.model';
import { CustomerService } from '../../services/customer.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
    selector: 'app-customer-list',
    standalone: false,
    templateUrl: './customer-list.component.html',
    styleUrls: ['./customer-list.component.css']
})
export class CustomerListComponent implements OnInit {
    displayedColumns: string[] = ['customerId', 'customerName', 'address', 'businessStartDate', 'customerType', 'phone', 'email', 'creditLimit', 'actions'];
    dataSource = new MatTableDataSource<Customer>([]);

    @ViewChild(MatPaginator) paginator!: MatPaginator;

    isEditMode: boolean = false; // To track if we're in edit mode
    selectedCustomer: Customer | null = null; // To store the selected customer for editing

    constructor(private customerService: CustomerService) {}

    ngOnInit() {
        this.loadCustomers();
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
    }

    loadCustomers() {
        this.customerService.getCustomers().subscribe((data: Customer[]) => {
            this.dataSource.data = data;
        });
    }

    // Open the form in edit mode with selected customer
    editCustomer(customer: Customer) {
        this.isEditMode = true;
        this.selectedCustomer = { ...customer }; // Create a copy to avoid direct mutation
    }

    // Handle customer update
    onCustomerUpdated(updatedCustomer: Customer) {
        const index = this.dataSource.data.findIndex(c => c.customerId === updatedCustomer.customerId);
        if (index !== -1) {
            this.dataSource.data[index] = updatedCustomer;
            this.dataSource._updateChangeSubscription(); // Refresh table data
        }
        this.resetForm();
    }

    // Handle customer addition
    onCustomerAdded(newCustomer: Customer) {
        this.dataSource.data = [newCustomer, ...this.dataSource.data]; // Add new customer to the top of the list
        this.dataSource._updateChangeSubscription(); // Refresh table data
        this.resetForm();
    }

    // Reset the form and switch to insert mode
    resetForm() {
        this.isEditMode = false;
        this.selectedCustomer = null;
    }

    // Function to handle customer delete
    deleteCustomer(customer: Customer) {
        if (confirm(`Are you sure you want to delete ${customer.customerName}?`)) {
            this.customerService.deleteCustomer(customer.id).subscribe(() => {
                this.loadCustomers(); // Reload the customers after delete
            });
        }
    }
}