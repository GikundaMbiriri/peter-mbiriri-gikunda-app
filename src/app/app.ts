import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AlertToastComponent } from './components/alert-toast/alert-toast';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AlertToastComponent],
  templateUrl: './app.html',
})
export class App {}
