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

    // Open the edit form with selected customer
    editCustomer(customer: Customer) {
        this.selectedCustomer = { ...customer }; // Create a copy to avoid direct mutation
    }

    // Handle customer update
    onCustomerUpdated(updatedCustomer: Customer) {
        const index = this.dataSource.data.findIndex(c => c.customerId === updatedCustomer.customerId);
        if (index !== -1) {
            this.dataSource.data[index] = updatedCustomer;
            this.dataSource._updateChangeSubscription(); // Refresh table data
        }
        this.selectedCustomer = null; // Hide form after update
    }

    // Cancel editing
    cancelEdit() {
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
