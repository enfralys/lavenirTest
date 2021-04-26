import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class PokemonService {
    public urlApi: string = 'https://pokeapi.co/api/v2/pokemon';

    constructor(private http: HttpClient) { }


    getPokemons(index) {
        return this.http.get(this.urlApi + '/' + index).toPromise();
    }
    getPokemonsSpecies(url) {
        return this.http.get(url).toPromise();
    }
    getPokemonsDetail(name) {
        return this.http.get(this.urlApi + '/' + name).toPromise();
    }
}
