import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product, Category } from '../../interfaces/models';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatGridListModule } from '@angular/material/grid-list';
import { ReactiveFormsModule } from '@angular/forms';
import {MatOption} from '@angular/material/core';
import {MatSelect} from '@angular/material/select';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';


@Component({
  selector: 'app-edit-product',
  standalone: true,
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss'],
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatGridListModule,
    ReactiveFormsModule,
    MatOption,
    MatSelect,
    MatSnackBarModule
  ],
})
export class EditProductComponent implements OnInit {
  editProductForm!: FormGroup;
  productId!: number;
  categories: Category[] = [];
  isSubmitting: boolean = false;



  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.productId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadCategories();




    // Inicializar Formulario
    this.editProductForm = this.fb.group({
      ean_gtin: ['', Validators.required],
      name: ['', Validators.required],
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
      category_id: [null, Validators.required],
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
      }),
    });
    // load data if product exists
    if (!isNaN(this.productId)) {
      this.productService.getProductById(this.productId).subscribe((product: Product) => {
        console.log("Producto recibido en edit:", product);

        if (product) {
          this.editProductForm.patchValue({
            ...product,
            name: this.capitalizeWords(product.name),
            category_id: product.category_id,
            manufacturer: {
              name: this.capitalizeWords(product.manufacturer.name),
              address: product.manufacturer.address,
              country: product.manufacturer.country
            },
          ingredients: Array.isArray(product.ingredients)
              ? product.ingredients.map((ing: any) => this.capitalizeWords(ing.name)).join(', ')
              : '',
            nutritionInfo: {
              energy_kcal: product.nutritionInfo?.energy_kcal ?? null,
              protein_g: product.nutritionInfo?.protein_g ?? null,
              fat_g: product.nutritionInfo?.fat_g ?? null,
              saturated_fat_g: product.nutritionInfo?.saturated_fat_g ?? null,
              carbohydrates_g: product.nutritionInfo?.carbohydrates_g ?? null,
              sugar_g: product.nutritionInfo?.sugar_g ?? null,
              fiber_g: product.nutritionInfo?.fiber_g ?? null,
              sodium_mg: product.nutritionInfo?.sodium_mg ?? null
            }
          });
        }
      });
    }
  }
  loadCategories(): void {
    this.productService.getCategories().subscribe({
      next: (categories: Category[]) => {
        this.categories = categories;
        console.log(" Categorías cargadas:", this.categories);
      },
      error: (error) => console.error("Fehler beim Laden der Kategorien:", error)
    });
  }


  submitForm(): void {
    if (this.editProductForm.valid) {
      const updatedProduct = {
        ...this.editProductForm.value,
        ingredients: this.convertIngredientsToArray(this.editProductForm.value.ingredients)
      };

      console.log("✅ Datos corregidos antes de enviar:", JSON.stringify(updatedProduct, null, 2));

      this.productService.updateProduct(this.productId, updatedProduct).subscribe({
        next: () => {
          this.snackBar.open('Produkt erfolgreich geändert!', 'Schließen', {
            duration: 3000,
            panelClass: ['mat-toolbar', 'mat-primary']

          });
          this.router.navigate(['/products']);
          this.isSubmitting = false;
        },
        error: (error) => {
          console.error('Fehler beim Erstellen des Produkts:', error);
          this.snackBar.open('Fehler beim Ändern des Produkts', 'Schließen', {
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

    if (Array.isArray(ingredients)) {
      return ingredients.map(ing => {
        if (typeof ing === "string") {
          return { name: ing.trim() };
        }
        if (typeof ing === "object" && ing.name && typeof ing.name === "string") {
          return { name: ing.name.trim() };
        }
        return { name: JSON.stringify(ing).trim() };
      });
    }

    if (typeof ingredients === "string") {
      return ingredients.split(",").map((name: string) => ({ name: name.trim() }));
    }

    return [];
  }


    cancelEdit(): void {
    this.router.navigate(['/products']);
  }

  capitalizeWords(value: string): string {
    return value
      ? value
        .toLowerCase()
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
      : "";
  }

}
