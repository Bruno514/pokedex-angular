import { Component, inject, effect } from '@angular/core';
import { PokemonService, PokemonGender, PokemonDetails } from './pokemon-service/pokemon-service';
import { Observable } from 'rxjs';
import { AsyncPipe, NgOptimizedImage } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  imports: [AsyncPipe, NgOptimizedImage, RouterLink],
  selector: 'app-pokemon',
  styleUrl: './pokemon.scss',
  templateUrl: './pokemon.html',
})
export class Pokemon {
  readonly pokemonId: string;

  pokemon$!: Observable<PokemonDetails>;
  gender$!: Observable<PokemonGender>

  evolutionChain$!: Observable<PokemonDetails[]>

  private pokemonService = inject(PokemonService);
  private route = inject(ActivatedRoute)

  constructor() {
    this.pokemonId = this.route.snapshot.paramMap.get('id') || '';

    effect(() => {
      this.pokemon$ = this.pokemonService.getPokemon(this.pokemonId);
      this.evolutionChain$ = this.pokemonService.getEvolutionChain(this.pokemonId)
      this.evolutionChain$.subscribe(c => c.forEach(g => console.log(g)))
    });
  }
}
