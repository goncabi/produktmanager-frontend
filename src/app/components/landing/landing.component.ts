import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {MatButton} from '@angular/material/button';
import {MatCard} from '@angular/material/card';
import {MatIcon} from '@angular/material/icon';
import { trigger, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
  standalone: true,
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.8s', style({ opacity: 1 }))
      ])
    ]),
  ],
  imports: [
    MatCard,
    MatIcon,
    MatButton,
  ],
})
export class LandingComponent {
  constructor(private router: Router) {
  }

  navigateToApp(): void {
    this.router.navigate(['/products']);
  }
  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}

