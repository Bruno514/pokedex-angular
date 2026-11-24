import { Component, inject, effect } from '@angular/core';
import { PokemonService, PokemonGender, PokemonDetails } from './pokemon-service/pokemon-service';
import { Observable } from 'rxjs';
import { AsyncPipe, NgOptimizedImage } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  imports: [AsyncPipe, NgOptimizedImage],
  selector: 'app-pokemon',
  styleUrl: './pokemon.scss',
  templateUrl: './pokemon.html',
})
export class Pokemon {
  readonly pokemonId: string;

  pokemon$!: Observable<PokemonDetails>;
  gender$!: Observable<PokemonGender>
  evolutionChain$!: Observable<any>

  private pokemonService = inject(PokemonService);
  private route = inject(ActivatedRoute)

  constructor() {
    this.pokemonId = this.route.snapshot.paramMap.get('id') || '';

    effect(() => {
      this.pokemon$ = this.pokemonService.getPokemon(this.pokemonId);
      this.gender$ = this.pokemonService.getGender('1');
      this.evolutionChain$ = this.pokemonService.getEvolutionChain('1')
      this.evolutionChain$.subscribe(c => console.log(c))
    });
  }
}
