import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CustomerService } from '../../services/customer.service';
import { saveAs } from 'file-saver'; // For file download

@Component({
    selector: 'app-report',
    standalone: false,
    templateUrl: './report.component.html',
    styleUrl: './report.component.css'
})
export class ReportComponent implements OnInit{
    filterForm!: FormGroup;
    customers: any[] = [];
    exportFormat: string = 'pdf';

    constructor(private fb: FormBuilder, private customerService: CustomerService) {}

    ngOnInit(): void {
        this.initFilterForm();
    }

    // Initialize the filter form
    initFilterForm(): void {
        this.filterForm = this.fb.group({
        customerType: [''],
        businessStartFrom: [''],
        businessStartTo: [''],
        });
    }

    // Handle filter submission
    onFilter(): void {
        const filters = this.filterForm.value;
        this.customerService
        .getFilteredCustomers(filters.customerType, filters.businessStartFrom, filters.businessStartTo)
        .subscribe(
            (data) => {
            this.customers = data;
            },
            (error) => {
            console.error('Error fetching filtered customers:', error);
            }
        );
    }

    // Handle export report
    onExport(): void {
        const filters = this.filterForm.value;
        this.customerService
        .exportCustomerReport(filters.customerType, filters.businessStartFrom, filters.businessStartTo, this.exportFormat)
        .subscribe(
            (data) => {
            const blob = new Blob([data], { type: this.getMimeType(this.exportFormat) });
            saveAs(blob, `CustomerReport.${this.exportFormat}`);
            },
            (error) => {
            console.error('Error exporting report:', error);
            }
        );
    }

    // Get MIME type based on export format
    getMimeType(format: string): string {
        switch (format) {
        case 'pdf':
            return 'application/pdf';
        case 'word':
            return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        case 'excel':
            return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        default:
            return 'application/octet-stream';
        }
    }
}
