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
    @Input() set customer(value: Customer | null) {
        this._customer = value;
        this.initForm();
    }
    get customer(): Customer | null {
        return this._customer;
    }
    private _customer: Customer | null = null;

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
            this.resetForm(); // Reset form after adding
        });
    }

    // Emit updated customer
    updateCustomer(customerData: Customer): void {
        if (!this.customer) return;

        const updatedData = { ...customerData, customerId: this.customer.customerId };

        this.customerService.updateCustomer(this.customer.id, updatedData).subscribe((updatedCustomer) => {
            this.customerUpdated.emit(updatedCustomer); // Emit updated customer
            alert('Customer updated successfully!');
            this.resetForm(); // Reset form after update
        });
    }

    // Handle delete action
    onDelete(): void {
        if (!this.customer) {
            alert('No customer selected for deletion.');
            return;
        }

        if (confirm(`Are you sure you want to delete ${this.customer.customerName}?`)) {
            this.customerService.deleteCustomer(this.customer.id).subscribe(() => {
                alert('Customer deleted successfully!');
                this.resetForm(); // Reset the form
                this.customerAdded.emit(); // Notify parent to reload the list
            });
        }
    }

    // Handle clear action
    onClear(): void {
        this.resetForm();
    }

    // Reset the form
    resetForm(): void {
        this.customerForm.reset(); // Reset the form
        //this.selectedCustomer = null; // Clear the selected customer
        this.deliveryAddresses.clear(); // Clear the delivery addresses FormArray
        this.addDeliveryAddress(); // Add one empty delivery address
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

    onPhotoUpload(event: Event): void {
        const input = event.target as HTMLInputElement;
    
        if (input.files && input.files.length > 0) {
            const file = input.files[0];
    
            // Validate file type (e.g., allow only images)
            if (!file.type.startsWith('image/')) {
                alert('Please upload a valid image file.');
                return;
            }
    
            // Validate file size (e.g., limit to 5MB)
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (file.size > maxSize) {
                alert('File size exceeds the maximum limit of 5MB.');
                return;
            }
    
            // Read the file and display a preview (optional)
            const reader = new FileReader();
            reader.onload = (e: ProgressEvent<FileReader>) => {
                const imageUrl = e.target?.result as string;
                this.displayImagePreview(imageUrl); // Optional: Display the image preview
            };
            reader.readAsDataURL(file);
    
            // Optionally, you can upload the file to the server here
            this.uploadPhoto(file);
        }
    }
    
    // Optional: Display the image preview
    displayImagePreview(imageUrl: string): void {
        const imagePreview = document.getElementById('image-preview') as HTMLImageElement;
        if (imagePreview) {
            imagePreview.src = imageUrl;
            imagePreview.style.display = 'block';
        }
    }
    
    // Optional: Upload the file to the server
    uploadPhoto(file: File): void {
        const formData = new FormData();
        formData.append('photo', file);
    
        this.customerService.uploadPhoto(formData).subscribe(
            (response) => {
                console.log('Photo uploaded successfully:', response);
                alert('Photo uploaded successfully!');
            },
            (error) => {
                console.error('Error uploading photo:', error);
                alert('Failed to upload photo.');
            }
        );
    }
}