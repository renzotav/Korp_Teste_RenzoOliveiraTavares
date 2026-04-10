import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatToolbarModule, MatButtonModule],
  template: `
    <mat-toolbar color="primary">
      <span>Sistema de Notas Fiscais</span>
      <span style="flex: 1"></span>
      <a mat-button routerLink="/produtos" routerLinkActive="active">Produtos</a>
      <a mat-button routerLink="/notas-fiscais" routerLinkActive="active">Notas Fiscais</a>
    </mat-toolbar>
    <div style="padding: 24px">
      <router-outlet />
    </div>
  `
})
export class AppComponent {}