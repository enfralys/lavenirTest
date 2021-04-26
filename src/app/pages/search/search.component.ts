import { Component, OnInit } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service'
import { Router } from "@angular/router";
import { LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
    /* Variables */
    error = false;
    pokemons: any = [];

    constructor(
        public pokemonApi: PokemonService,
        public router: Router,
        public loadingController: LoadingController,
        private auth: AuthService

    ) {
        this.getLoadPokemons();
    }

    ngOnInit() {
    }

    async getLoadPokemons() {
        this.pokemons = [];

        const loading = await this.loadingController.create({
            cssClass: 'my-custom-class',
            message: 'Por favor espere...',
            duration: 0
        });
        await loading.present();

        for (let i = 1; i < 20; i++) {
            let res = await this.pokemonApi.getPokemons(i) as any;

            if (res) {

                let data = await this.pokemonApi.getPokemonsSpecies(res.species.url) as any;

                // console.log(res);

                if (data) {

                    let text = data.flavor_text_entries.find(el => el.language.name == 'es');

                    let pokemon = {
                        position: i,
                        image: res.sprites.other.dream_world.front_default,
                        name: res.name,
                        description: text.flavor_text,
                        base_happiness: data.base_happiness,
                    }
                    this.pokemons.push(pokemon);

                    loading.dismiss();
                }
            }
        }
    }

    async searchName(event) {
        this.error = false;
        if (event == '') {
            this.getLoadPokemons();
            return;
        }

        const loading = await this.loadingController.create({
            cssClass: 'my-custom-class',
            message: 'Por favor espere...',
            duration: 0
        });
        await loading.present();

        try {
            let res = await this.pokemonApi.getPokemonsDetail(event.toLowerCase()) as any;
            if (res) {
                loading.dismiss();
                this.pokemons = [];
                let pokemon = {
                    image: res.sprites.other.dream_world.front_default,
                    name: res.name,
                }
                this.pokemons.push(pokemon);
            }
        } catch (e) {
            this.pokemons = [];
            console.log('Error', e);
            loading.dismiss();
            this.error = true;
        }

    }

    getDetailPokemon(pokemon) {
        this.router.navigate(["/detail/" + pokemon.name]);
    }

    logOut() {
        this.auth.SignOut();
    }
}