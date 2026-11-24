import { Component, inject, effect } from '@angular/core';
import { PokemonService, PokemonGender, PokemonDetails } from './pokemon-service/pokemon-service';
import { Observable } from 'rxjs';
import { AsyncPipe, NgOptimizedImage } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Navbar } from '../navbar/navbar';

@Component({
  imports: [AsyncPipe, NgOptimizedImage, RouterLink, Navbar],
  selector: 'app-pokemon',
  styleUrl: './pokemon.scss',
  templateUrl: './pokemon.html',
})
export class Pokemon {
  pokemon$!: Observable<PokemonDetails>;
  gender$!: Observable<PokemonGender>

  evolutionChain$!: Observable<PokemonDetails[]>

  private pokemonService = inject(PokemonService);
  private route = inject(ActivatedRoute)

  constructor() {
    this.route.params.subscribe(params => {
      const pokemonId = params['id'];

      this.pokemon$ = this.pokemonService.getPokemon(pokemonId);
      this.evolutionChain$ = this.pokemonService.getEvolutionChain(pokemonId)
    });
  }
}
