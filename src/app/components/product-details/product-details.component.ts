import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product, Category} from '../../interfaces/models';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatCardModule} from '@angular/material/card';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ConfirmationDialogComponent} from '../confirmation-dialog/confirmation-dialog.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatExpansionModule, MatCardModule, ReactiveFormsModule] // Agregamos CommonModule y FormsModule
})
export class ProductDetailsComponent implements OnInit {
  product: Product = {
    product_id: 0,
    ean_gtin: '',
    sku_plu: '',
    name: '',
    description: '',
    image_url: '',
    price_delivery: 0,
    price_pickup: 0,
    net_weight_g: 0,
    net_volume_l: 0,
    gross_weight_g: 0,
    alcohol_volume: 0,
    caffeine_mg: 0,
    deposit_amount: 0,
    ingredients: [],
    nutritionInfo: {
      energy_kcal: 0,
      protein_g: 0,
      fat_g: 0,
      saturated_fat_g: 0,
      carbohydrates_g: 0,
      sugar_g: 0,
      fiber_g: 0,
      sodium_mg: 0
    },
    category_id: 0,
    category_name: '',
    manufacturer: { manufacturer_id: 0, name: 'Keine', address: 'Keine', country: 'Keine' }
  };
  ingredientNames: string = '';
  categories: Category[] = [];
  editMode = false;


  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadProduct();
    this.loadCategories();

  }

  loadProduct(): void {
    const productId = Number(this.route.snapshot.paramMap.get('id'));
    if (!isNaN(productId)) {
      this.productService.getProductById(productId).subscribe(
        product => {
          console.log("Producto recibido en Angular:", product); // 🔥 DEBUG

          if (!product) {
            console.error("El producto es null o undefined");
            return;
          }
          product.manufacturer = product.manufacturer || { id: 0, name: '', address: '', country: '' };

          this.product = product;


          // Aseguramos que `ingredients` sea un array de objetos `Ingredient`
          if (Array.isArray(product.ingredients)) {
            this.product.ingredients = product.ingredients.map(i => ({ name: i.name }));
          }
        },
        error => {
          console.error("Error al obtener producto:", error);
        }
      );
    } else {
      console.error("ID de producto no válido.");
    }
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
  }
  /** 📝 Bearbeiten */
  editProduct(product: Product): void {
    if (product?.product_id) {
      console.log("🔄 Navigiere zur Bearbeitung des Produkts mit ID:", product.product_id);
      this.router.navigate(['/edit-product', product.product_id]);
    } else {
      console.error("⚠️ Fehler: Das Produkt hat keine gültige ID:", product);
    }
  }

  deleteProduct(product: Product): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      height: 'auto',
      data: {
        title: 'Bist du sicher?',
        message: `Möchtest du das Produkt "${product.name}" wirklich löschen?`
      }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result === true) {
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

  cancelEdit(): void {
    this.editMode = false;
    this.loadProduct();
  }

}
