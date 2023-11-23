import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GameComponent } from './game/game.component';
import { ReglesComponent } from './regles/regles.component';

const routes: Routes = [
  { path: '', component: GameComponent },
  { path: 'regles', component: ReglesComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
