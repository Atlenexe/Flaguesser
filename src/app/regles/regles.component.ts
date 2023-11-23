import { Component, OnInit } from '@angular/core';
import { StreakStore } from '../store/streak.store';

@Component({
  selector: 'app-regles',
  templateUrl: './regles.component.html',
  styleUrls: ['./regles.component.scss']
})
export class ReglesComponent implements OnInit {

  streakStore: StreakStore;

  bestStreak: number = 0;

  constructor(streakStore: StreakStore) {
    this.streakStore = streakStore;
  }

  ngOnInit() {
    this.bestStreak = this.streakStore.getStreak();
  }

}
