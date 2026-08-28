import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../components/sidebar/sidebar';

@Component({
  imports: [RouterOutlet, Sidebar],
  selector: 'app-authenticated-layout',
  styleUrl: './authenticated-layout.scss',
  templateUrl: './authenticated-layout.html',
})
export class AuthenticatedLayout {}
