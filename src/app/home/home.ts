import { AsyncPipe, NgOptimizedImage } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { PokemonService, PokemonDetails } from '../pokemon/pokemon-service/pokemon-service';
import { Router, RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  imports: [AsyncPipe, NgOptimizedImage, RouterLink],
  selector: 'app-home',
  styleUrl: './home.scss',
  templateUrl: './home.html',
})
export class Home {
  pokemonsPaginated$!: Observable<PokemonDetails[]>;

  private pokemonService = inject(PokemonService);
  private router = inject(Router)
  private route = inject(ActivatedRoute)

  // Source - https://stackoverflow.com/a/38129910
  // Posted by Doron Brikman
  // Retrieved 2026-11-24, License - CC BY-SA 3.0

  constructor() {
    this.route.params.subscribe(params => {
      const pageId = params['page'];
      this.pokemonsPaginated$ = this.pokemonService.getPokemonsByPage(parseInt(pageId));
    });

  }

  changePage(direction: 'prev' | 'next') {
    const pageId = this.route.snapshot.paramMap.get('page') || '';
    const newPage = direction == 'prev' ? parseInt(pageId) - 1 : parseInt(pageId) + 1

    if (newPage == 0) {
      return;
    }

    this.router.navigate(['/', newPage], { onSameUrlNavigation: "reload" });
  }
}
