import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class StreakStore {
  bestStreak: number = JSON.parse(localStorage.getItem('bestStreak')!) | 0;

  constructor() { }

  getStreak(): number {
    return this.bestStreak;
  }

  setStreak(newStreak: number): void {
    this.bestStreak = newStreak;
    localStorage.setItem('bestStreak', JSON.stringify(this.bestStreak));
  }
}