import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, switchMap, map, forkJoin } from 'rxjs';

export type PokemonDetails = {
  id: string,
  name: String,
  height: number,
  weight: Number,
  types: Object[],
  sprites: {
    other: {
      home: {
        back_female: String,
        front_shiny: String,
        back_default: String,
        front_female: String,
        front_default: String,
        back_shiny_female: String,
        front_shiny_female: String
      }
    }
  }
  species: {
    url: String
  }
}

export type PokemonGender = {
  name: String
}

export type PokemonEvolutionChain = {
  chain: any,
  species: {
    name: String,
    url: String
  },
  evolves_to: PokemonEvolutionChain[]
}

@Service()
export class PokemonService {
  private http = inject(HttpClient);

  getPokemonsByUrls(list: any[]): Observable<PokemonDetails[]> {
    const pokemonRequests = list.map(item =>
      this.http.get<PokemonDetails>(item.url)
    );

    return forkJoin(pokemonRequests).pipe(
      map(pokemons => ([
        ...pokemons
      ]))
    );
  }

  getPokemonsByPage(page: number, limit = 20): Observable<PokemonDetails[]> {
    const offset = (page - 1) * limit;

    return this.http.get<{ count: number; results: { name: string; url: string }[] }>(`${environment.apiUrl}/pokemon/`, {
      params: {
        limit: limit.toString(),
        offset: offset.toString()
      }
    }).pipe(
      switchMap(response => {
        const pokemonRequests = response.results.map(item =>
          this.http.get<PokemonDetails>(item.url)
        );

        return forkJoin(pokemonRequests).pipe(
          map(pokemons => ([
            ...pokemons
          ]))
        );
      })
    )
  }


  getPokemon(id: string): Observable<PokemonDetails> {
    return this.http.get<PokemonDetails>(`${environment.apiUrl}/pokemon/${id}`);
  }

  getGender(id: string): Observable<{ name: string }> {
    return this.http.get<{ name: string }>(`${environment.apiUrl}/gender/${id}`);
  }

  getEvolutionChain(id: string): Observable<PokemonDetails[]> {
    return this.getPokemon(id).pipe(
      switchMap(pokemon =>
        this.http.get<{
          evolution_chain: {
            url: String,
          }
        }>(pokemon.species.url.toString())
      ),
      switchMap(species =>
        this.http.get<PokemonEvolutionChain>(species.evolution_chain.url.toString())
      ),
      map(evolution => {
        const evolutionChain = [];
        let evolutionData = evolution.chain;

        while (evolutionData) {
          evolutionChain.push({
            species_name: evolutionData.species.name,
            species_url: evolutionData.species.url
          });

          evolutionData = evolutionData.evolves_to[0];
        }

        return evolutionChain;
      })
    ).pipe(switchMap(response => {
      console.log(response)
      const pokemonRequests = response.map(item =>
        this.getPokemon(item.species_name)
      );

      return forkJoin(pokemonRequests).pipe(
        map(pokemons => ([
          ...pokemons
        ]))
      );
    })
    );
  }
}
