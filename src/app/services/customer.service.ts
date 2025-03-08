import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs'; 
import { Customer } from '../models/customer.model';

@Injectable({
    providedIn: 'root',
})
export class CustomerService {

    private apiUrl = 'https://localhost:44328/api/customers';  // Replace with your actual API URL

    constructor(private http: HttpClient) {}

    // Get all customers
    getCustomers(): Observable<Customer[]> {
        return this.http.get<Customer[]>(this.apiUrl);
    }

    // Get a single customer by ID
    getCustomer(id: number): Observable<Customer> {
        return this.http.get<Customer>(`${this.apiUrl}/${id}`);
    }

    // Create a new customer
    createCustomer(customer: Customer): Observable<Customer> {
        return this.http.post<Customer>(this.apiUrl, customer);
    }

    // Update an existing customer
    updateCustomer(id: number, customer: Customer): Observable<Customer> {
        return this.http.put<Customer>(`${this.apiUrl}/${id}`, customer);
    }

    // Delete a customer
    deleteCustomer(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
    uploadPhoto(formData: FormData): Observable<any> {
        return this.http.post('/api/upload-photo', formData);
    }
    // Fetch filtered customers
  getFilteredCustomers(customerType: string, businessStartFrom: string, businessStartTo: string): Observable<any[]> {
    const params: any = {};
    if (customerType) params.customerType = customerType;
    if (businessStartFrom) params.businessStartFrom = businessStartFrom;
    if (businessStartTo) params.businessStartTo = businessStartTo;

    return this.http.get<any[]>(`${this.apiUrl}/report`, { params });
  }

  // Export report
  exportCustomerReport(customerType: string, businessStartFrom: string, businessStartTo: string, format: string): Observable<Blob> {
    const params: any = { format };
    if (customerType) params.customerType = customerType;
    if (businessStartFrom) params.businessStartFrom = businessStartFrom;
    if (businessStartTo) params.businessStartTo = businessStartTo;

    return this.http.post(`${this.apiUrl}/export-report`, null, {
      params,
      responseType: 'blob',
    });
  }
}
