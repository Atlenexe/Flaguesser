import { Component, OnInit } from '@angular/core';
import { StreakStore } from '../store/streak.store';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  streakStore: StreakStore;

  countries: any;
  countryName: string = '';
  countryCode: string = '';

  nbFaussesPropositions: number = 3;
  streak: number = 0;
  bestStreak: number = 0;
  propositions: string[] = [];
  propositionsFinales: string[] = [];
  guess: string = '';

  loading: boolean = true;
  disable: boolean = false;

  constructor(streakStore: StreakStore) {
    this.streakStore = streakStore;
  }

  //Récupération des pays au lancement de la page
  ngOnInit() {
    this.getCountries();

    //Meilleur score
    this.bestStreak = this.streakStore.getStreak();
  }

  //Image loading?
  onLoad() {
    this.loading = false;
  }

  //Récupération des codes et noms des pays à l'API
  getCountries(): void {
    fetch('https://flagcdn.com/fr/codes.json')
      .then(res => res.json())
      .then(json => {
        let keys = Object.keys(json);

        //Filtrage de tous les pays
        for (let i = 0; i < keys.length; i++) {
          const key = keys[i];

          //Élimination des états des US (code supérieur à 2 caractères)
          if (keys[i].length > 2) {
            delete json[key];
            delete keys[i];
          }

          //Élimination de l'Union Européenne (code "eu")
          if (keys[i] == 'eu') {
            delete json[key];
            delete keys[i];
          }
        }

        this.countries = json;

        //Création des premières propositions
        this.getRandCountry();
      });
  }

  //Récupération d'un pay aléatoirement (bonne réponse)
  getRandCountry(): void {
    const keys = Object.keys(this.countries);

    //Randomisation des pays
    const randIndex = Math.floor(Math.random() * keys.length);
    //Codes pays randomisés
    const randKey = keys[randIndex];

    //Setter de la bonne réponse
    this.countryName = this.countries[randKey];
    this.countryCode = randKey;

    //Chargement des 4 propositions
    this.setPropositions();
  }

  //Chargement des 4 propositions
  setPropositions(): void {
    this.propositions = [];
    const keys = Object.keys(this.countries);

    //Ajout de la bonne réponse dans la liste des propositions
    this.propositions.push(this.countryName);

    //Ajout des 3 autres propositions (fausses)
    for (let i = 0; i < this.nbFaussesPropositions; i++) {
      //Récup d'un pays aléatoire
      const randIndex = Math.floor(Math.random() * keys.length);
      const randKey = keys[randIndex];

      //Si pays n'est pas déjà présent dans les propositions ou pas bonne réponse
      if (!this.propositions.includes(this.countries[randKey]) && this.countries[randKey] != this.countryName) {
        //Ajout de la fausse proposition
        this.propositions.push(this.countries[randKey]);
      } else {
        //Relancement recherche du faux pays
        i--;
      }
    }

    //Randomisation des propositions
    const shuffledPropositions = this.propositions.sort((a, b) => 0.5 - Math.random());

    //4 propositions finales randomisées
    this.propositionsFinales = shuffledPropositions;
  }

  //Action de submit côté utilisateur
  submit(value: any): void {
    this.guess = value;

    //Bonne réponse?
    if (value == this.countryName) {
      this.getRandCountry();
      this.streak++;

      //Si nouveau meilleur score
      if (this.streak > this.bestStreak) {
        this.bestStreak = this.streak;
        this.streakStore.setStreak(this.bestStreak);
      }
    } else {
      this.stopStreak();
    }
  }

  //Mauvaise réponse, bloquage du jeu
  stopStreak(): void {
    this.disable = true;
  }

  //Relancement du jeu
  restart(): void {
    this.streak = 0;
    this.disable = false;
    this.getRandCountry();
  }
}
