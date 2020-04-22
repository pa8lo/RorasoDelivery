import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DetallePedidoPage } from './detalle-pedido.page';

const routes: Routes = [
  {
    path: '',
    component: DetallePedidoPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [DetallePedidoPage]
})
export class DetallePedidoPageModule {}
