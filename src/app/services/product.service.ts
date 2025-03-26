import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category, Product } from '../interfaces/models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = environment.apiUrl; // Esto se ajusta dependiendo del environment (Producción o Desarrollo)

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products`);
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/products/${id}`);
  }

  addProduct(newProduct: Product): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/products`, newProduct);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/products/${id}`);
  }

  updateProduct(id: number, updatedProduct: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/products/${id}`, updatedProduct);
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/products/categories`);
  }
}
