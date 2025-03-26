import { Component } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { Location } from '@angular/common';  // ✅ IMPORTACIÓN CORRECTA

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: true,
  imports: [
    MatToolbar,
    MatIcon,
    MatButtonModule,
    MatTooltip,
    RouterLink
  ]
})
export class NavbarComponent {

  constructor(private location: Location) {}

  goBack(): void {
    this.location.back();
  }
}
