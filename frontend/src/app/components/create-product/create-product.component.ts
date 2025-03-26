import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { Product, Category } from '../../interfaces/models';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatGridListModule } from '@angular/material/grid-list';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import {MatSnackBar} from '@angular/material/snack-bar';



@Component({
  selector: 'app-create-product',
  standalone: true,
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.scss'],
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatGridListModule,
    ReactiveFormsModule,
    MatSelectModule
  ],
})export class CreateProductComponent implements OnInit {
  addProductForm!: FormGroup;
  categories: Category[] = [];
  isSubmitting: boolean = false;


  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.addProductForm = this.fb.group({
      ean_gtin: ['', Validators.required],
      name: ['', Validators.required],
      category_id: [null, Validators.required],
      image_url: [''],
      price_delivery: [0],
      price_pickup: [0],
      net_volume_l: [0],
      net_weight_g: [0],
      gross_weight_g: [0],
      alcohol_volume: [null],
      caffeine_mg: [null],
      deposit_amount: [null],
      ingredients: [''],

      manufacturer: this.fb.group({
        name: ['', Validators.required],
        address: [''],
        country: ['']
      }),
      nutritionInfo: this.fb.group({
        energy_kcal: [null],
        protein_g: [null],
        fat_g: [null],
        saturated_fat_g: [null],
        carbohydrates_g: [null],
        sugar_g: [null],
        fiber_g: [null],
        sodium_mg: [null]
      })
    });
    this.loadCategories();
  }

loadCategories(): void {
  this.productService.getCategories().subscribe(categories => {
    this.categories = categories;
  });
}


  submitForm(): void {
    if (this.addProductForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      const newProduct = {
        ...this.addProductForm.value,
        ingredients: this.convertIngredientsToArray(this.addProductForm.value.ingredients)
      };

      console.log("✅ Produktdaten vor dem Senden:", JSON.stringify(newProduct, null, 2));

      this.productService.addProduct(newProduct).subscribe({
          next: () => {
            this.snackBar.open('Produkt erfolgreich erstellt!', 'Schließen', {
              duration: 3000,
              panelClass: ['mat-toolbar', 'mat-primary']

            });
            this.router.navigate(['/products']);
            this.isSubmitting = false;
          },
            error: (error) => {
            console.error('Fehler beim Erstellen des Produkts:', error);
            this.snackBar.open('Fehler beim Erstellen des Produkts', 'Schließen', {
              duration: 3000,
              panelClass: ['mat-toolbar', 'mat-warn'],
              horizontalPosition: 'center',
              verticalPosition: 'top'
            });
            this.isSubmitting = false;
          }
        });
    }
  }

  convertIngredientsToArray(ingredients: any): { name: string }[] {
    if (!ingredients) return [];

    if (typeof ingredients === "string") {
      return ingredients.split(",").map((name: string) => ({ name: name.trim() }));
    }

    if (Array.isArray(ingredients)) {
      return ingredients.map(ing => (typeof ing === "string" ? { name: ing.trim() } : ing));
    }

    return [];
  }

  cancelCreation(): void {
    this.router.navigate(['/products']);
  }
}

