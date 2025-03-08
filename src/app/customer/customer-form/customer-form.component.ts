import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Customer, DeliveryAddress } from '../../models/customer.model';
import { CustomerService } from '../../services/customer.service';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-customer-form',
  standalone: false,
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.css']
})
export class CustomerFormComponent implements OnInit {
    @Input() customer: Customer | null = null; // To bind to the form for editing
    @Output() customerUpdated = new EventEmitter<Customer>(); // Emit updated customer
    @Output() customerAdded = new EventEmitter<Customer>(); // Emit added customer

    customerForm!: FormGroup; // Form group for customer data

    constructor(private fb: FormBuilder, private customerService: CustomerService) {}

    ngOnInit(): void {
        this.initForm();
    }

    // Initialize the form with either new data or data from the input customer
    initForm(): void {
        this.customerForm = this.fb.group({
            customerId: [this.customer?.customerId || ''],
            customerName: [this.customer?.customerName || '', Validators.required],
            address: [this.customer?.address || '', Validators.required],
            businessStartDate: [this.customer?.businessStartDate || '', Validators.required],
            customerType: [this.customer?.customerType || '', Validators.required],
            phone: [
                this.customer?.phone || '',
                [Validators.required, this.phoneValidator]
            ],
            email: [
                this.customer?.email || '',
                [Validators.required, Validators.email]
            ],
            creditLimit: [
                this.customer?.creditLimit || 0,
                [Validators.required, Validators.min(1000), Validators.max(1000000)]
            ],
            deliveryAddressInfo: this.fb.array(
                this.customer?.deliveryAddressInfo?.map(address => this.createAddressGroup(address)) || [this.createAddressGroup()]
            )
        });
    }
    
    // Create address group for form array
    createAddressGroup(address: DeliveryAddress = {id: 0, address: '', contactPersonName: '', phone: '', customerId: 0}): FormGroup {
        return this.fb.group({
            id: [address.id],
            address: [address.address, Validators.required],
            contactPersonName: [address.contactPersonName, Validators.required],
            phone: [
                address.phone, 
                [Validators.required, Validators.pattern(/^01\d{9}$/)] // Phone validation starts with '01' and exactly 11 digits
            ],
            customerId: [address.customerId]
        });
    }
    
    get deliveryAddresses() {
        return (this.customerForm.get('deliveryAddressInfo') as FormArray);
    }
    
    addDeliveryAddress() {
        this.deliveryAddresses.push(this.createAddressGroup());
    }
    
    removeDeliveryAddress(index: number) {
        this.deliveryAddresses.removeAt(index);
    }

    // Handle form submission for both add and update
    onSubmit(): void {
        if (this.customerForm.invalid) {
            return;
        }

        const formValue = this.customerForm.value;
        if (this.customer) {
            // If the customer exists, it means we're updating
            this.updateCustomer(formValue);
        } else {
            // If customer doesn't exist, we're adding a new one
            this.addCustomer(formValue);
        }
    }

    // Create a new customer
    addCustomer(customerData: Customer): void {
        this.customerService.createCustomer(customerData).subscribe((newCustomer) => {
            this.customerAdded.emit(newCustomer); // Emit added customer
            alert('Customer added successfully!');
            this.customerForm.reset(); // Reset form after adding
        });
    }

    
    // Emit updated customer
    updateCustomer(customerData: Customer): void {
        if (!this.customer) return;
        
        const updatedData = { ...customerData, customerId: this.customer.customerId };

        this.customerService.updateCustomer(this.customer.id, updatedData).subscribe((updatedCustomer) => {
            this.customerUpdated.emit(updatedCustomer); // Emit updated customer
            alert('Customer updated successfully!');
        });
    }

    // Custom Validator for Phone
    phoneValidator(control: any): { [key: string]: boolean } | null {
        const phone = control.value;
        const phonePattern = /^01\d{9}$/;
        if (phone && !phonePattern.test(phone)) {
            return { 'invalidPhone': true }; // Custom error
        }
        return null;
    }
}
