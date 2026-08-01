import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'outros-creditos-debitos',
    loadComponent: () =>
      import(
        './features/pages/consulta-lotes/consulta-lotes'
      ).then(
        (component) => component.ConsultaLotesComponent
      ),
    title: 'Outros Créditos/Débitos',
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'outros-creditos-debitos',
  },
  {
    path: '**',
    redirectTo: 'outros-creditos-debitos',
  },
];