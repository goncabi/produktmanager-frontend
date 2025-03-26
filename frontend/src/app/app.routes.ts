import { Routes } from '@angular/router';import { provideRouter } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductTableComponent } from './components/product-table/product-table.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import {LandingComponent} from './components/landing/landing.component';
import { EditProductComponent } from './components/edit-product/edit-product.component';
import { CreateProductComponent } from './components/create-product/create-product.component';

export const routes: Routes = [
  { path: '', redirectTo: '/landing', pathMatch: 'full' },
  { path: 'landing', component: LandingComponent },
  { path: 'products', component: ProductTableComponent },
  { path: 'product/:id', component: ProductDetailsComponent },
  { path: 'edit-product/:id', component: EditProductComponent },
  { path: 'create-product', component: CreateProductComponent },
  { path: '**', redirectTo: '' }, // not found routes redirect to landing page
]

export const appProviders = [
  provideRouter(routes),
  importProvidersFrom(FormsModule)
];
