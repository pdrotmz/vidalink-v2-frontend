import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmCard } from '@spartan-ng/helm/card';

@Component({
  selector: 'app-home',
  imports: [
    RouterLink,
    HlmButton,
    HlmCard,
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {}