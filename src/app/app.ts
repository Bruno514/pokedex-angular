import { Component, signal } from '@angular/core';
import { Pokemon } from './pokemon/pokemon';
import { RouterOutlet } from '@angular/router';

@Component({
  imports: [RouterOutlet],
  selector: 'app-root',
  template: `
    <router-outlet />
  `,
})
export class App {
}
