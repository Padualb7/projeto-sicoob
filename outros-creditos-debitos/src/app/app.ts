import { Component } from '@angular/core';
import { ConsultaLotesComponent } from "./features/pages/consulta-lotes/consulta-lotes";

@Component({
  selector: 'app-root',
  imports: [ConsultaLotesComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'outros-creditos-debitos';
}
