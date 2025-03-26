import { Component, OnInit } from '@angular/core';
import {MatCell, MatHeaderCell, MatHeaderRow, MatRow, MatTable, MatTableDataSource, MatTableModule} from '@angular/material/table';
import { ProductService } from '../../services/product.service';
import {Product} from '../../interfaces/models';
import { Router } from '@angular/router';
import {CommonModule} from '@angular/common';
import {MatIcon} from '@angular/material/icon';
import {MatToolbar} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatTooltip} from '@angular/material/tooltip';
import {NgIf} from '@angular/common';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmationDialogComponent} from '../confirmation-dialog/confirmation-dialog.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';


@Component({
  selector: 'app-product-table',
  templateUrl: './product-table.component.html',
  imports: [
    MatTableModule,
    MatHeaderCell,
    MatCell,
    MatTable,
    MatHeaderRow,
    MatRow,
    MatIcon,
    MatToolbar,
    MatButtonModule,
    MatTooltip,
    CommonModule,
    NgIf, MatSnackBarModule, MatFormFieldModule,
    MatInputModule
  ],
  styleUrls: ['./product-table.component.scss']
})
export class ProductTableComponent implements OnInit {
  displayedColumns: string[] = ['image', 'ean', 'category', 'name', 'weightVolume', 'manufacturer', 'actions'];

  dataSource = new MatTableDataSource<Product>();

  constructor(private productService: ProductService, private router: Router, private dialog: MatDialog, private snackBar: MatSnackBar) {
  }


  ngOnInit(): void {
    this.loadProducts();

    // Permitir que el filtro busque en múltiples campos
    this.dataSource.filterPredicate = (data: Product, filter: string): boolean => {
      const manufacturerName = data.manufacturer?.name || '';
      const dataStr = (`${data.name} ${data.category_name} ${manufacturerName} ${data.ean_gtin}`).trim().toLowerCase();
      return dataStr.includes(filter);
    };
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe(products => {
      console.log('Productos recibidos:', products);
      this.dataSource.data = products;
      console.log('DataSource después de cargar productos:', this.dataSource.data);
    });
  }

  viewDetails(product: Product): void {
    if (product && product.product_id !== undefined && product.product_id !== null) {
      console.log("Navegando a detalles del producto con ID:", product.product_id); // Debug
      this.router.navigate(['/product', product.product_id]);
    } else {
      console.error("Error: El producto no tiene un ID válido:", product);
    }
  }

  editProduct(product: Product): void {
    if (product && product.product_id !== undefined && product.product_id !== null) {
      console.log("Navegando a la edición del Producto mit ID:", product.product_id);
      this.router.navigate(['/edit-product', product.product_id]);
    } else {
      console.error("Fehler: Das Produkt hat keine gültige ID:", product);
    }
  }

  deleteProduct(product: Product): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px', // Cambia este valor para ajustar el tamaño
      height: 'auto', // Deja auto o ajusta a un tamaño fijo si prefieres
      data: {
        title: 'Bist du sicher?',
        message: `Möchtest du das Produkt "${product.name}" wirklich löschen?`
      }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result === true) { // El usuario confirmó
        this.productService.deleteProduct(product.product_id).subscribe({
          next: () => {
            this.snackBar.open('✅ Produkt erfolgreich gelöscht!', 'Schließen', {
              duration: 3000,
              verticalPosition: 'top',
              horizontalPosition: 'center'
            });
            this.router.navigate(['/products']);
          },
          error: (err) => {
            console.error("❌ Fehler beim Löschen des Produkts:", err);
            this.snackBar.open('❌ Fehler: Das Produkt konnte nicht gelöscht werden.', 'Schließen', {
              duration: 3000,
              verticalPosition: 'top',
              horizontalPosition: 'center'
            });
          }
        });
      }
    });
  }
}
