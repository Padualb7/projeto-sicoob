import { Component } from '@angular/core';
import { PainelFiltrosComponent } from "./features/components/painel-filtros/painel-filtros";

@Component({
  selector: 'app-root',
  imports: [ PainelFiltrosComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'outros-creditos-debitos';
}
