import { AsyncPipe, NgOptimizedImage } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { PokemonService, PokemonDetails } from '../pokemon/pokemon-service/pokemon-service';

@Component({
  imports: [AsyncPipe, NgOptimizedImage],
  selector: 'app-home',
  styleUrl: './home.scss',
  templateUrl: './home.html',
})
export class Home {
  pokemonsPaginated$!: Observable<PokemonDetails[]>;

  private pokemonService = inject(PokemonService);

  constructor() {
    effect(() => {
      this.pokemonsPaginated$ = this.pokemonService.getPokemonsByPage(1)
    })
  }
}
