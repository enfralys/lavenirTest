import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { PokemonService } from '../../services/pokemon.service'
import { Location } from '@angular/common';

@Component({
    selector: 'app-detail',
    templateUrl: './detail.page.html',
    styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {

    name: any;
    pokemon: any;

    constructor(private route: ActivatedRoute, public pokemonApi: PokemonService, private _location: Router) {
        this.name = this.route.snapshot.paramMap.get("pokemon");

        this.loadPokemon();
    }

    async loadPokemon() {

        try {
            let res = await this.pokemonApi.getPokemonsDetail(this.name) as any;

            if (res) {

                let data = await this.pokemonApi.getPokemonsSpecies(res.species.url) as any;

                // console.log(res);

                if (data) {

                    let text = data.flavor_text_entries.find(el => el.language.name == 'es');

                    this.pokemon = {
                        image: res.sprites.other.dream_world.front_default,
                        name: res.name,
                        description: text.flavor_text,
                        base_happiness: data.base_happiness,
                    }

                }
            }
        } catch (e) {
            console.log('Error: ', e);
        }
    }

    easyBack() {
        this._location.navigateByUrl("search");
    }

    ngOnInit() {
    }

}
