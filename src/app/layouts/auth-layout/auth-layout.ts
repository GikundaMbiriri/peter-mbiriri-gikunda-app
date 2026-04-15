import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar';
import { FooterComponent } from '../../components/footer/footer';

@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  templateUrl: './auth-layout.html',
})
export class AuthLayoutComponent {}
