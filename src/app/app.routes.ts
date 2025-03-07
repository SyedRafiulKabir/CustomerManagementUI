import { Routes } from '@angular/router';

export const routes: Routes = [
	{
		path: 'customer',
		loadChildren: () => import('./customer/customer.module').then(m => m.CustomerModule)
	},
	{ path: '', redirectTo: '/customer', pathMatch: 'full' }
];
