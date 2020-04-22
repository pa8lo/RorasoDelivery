import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { HomePage } from './home.page';
import { LoginComponent } from '../login/login.component';
import { DetallePedidoPage } from '../detalle-pedido/detalle-pedido.page';
import { DetallesPedidoComponent } from '../detalles-pedido/detalles-pedido.component';
import { ListaProductosComponent } from '../lista-productos/lista-productos.component';
import { MapComponent } from '../map/map.component';
import { PrincipalComponent } from '../principal/principal.component';
import { DetallesComponent } from '../detalles/detalles.component';
import { ListapedidosComponent } from '../listapedidos/listapedidos.component';
import { SinPedidosComponent } from '../sin-pedidos/sin-pedidos.component';
import { NoGpsComponent } from '../no-gps/no-gps.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      }
    ])
  ],
  declarations: [
    HomePage,
    DetallesPedidoComponent,
    ListaProductosComponent,
    MapComponent,
    LoginComponent,
    PrincipalComponent,
    DetallesComponent,
    ListapedidosComponent,
    SinPedidosComponent,
    NoGpsComponent
    ],
  entryComponents:[DetallesPedidoComponent,ListaProductosComponent,LoginComponent,DetallesComponent,ListapedidosComponent]
})
export class HomePageModule {}
