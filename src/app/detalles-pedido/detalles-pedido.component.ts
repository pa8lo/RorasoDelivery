import { Component, OnInit, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { ListaProductosComponent } from '../lista-productos/lista-productos.component';
import * as moment from 'moment';

@Component({
  selector: 'app-detalles-pedido',
  templateUrl: './detalles-pedido.component.html',
  styleUrls: ['./detalles-pedido.component.scss'],
})
export class DetallesPedidoComponent implements OnInit {

  public pedido;
  date;
  constructor(public popoverController: PopoverController ) { }
  @Input("value") value;
  ngOnInit() {
    this.pedido = this.value
    console.log(this.pedido)
    this.date = new Date(this.pedido.Date);
  }
  async showProducts() {
    const popover = await this.popoverController.create({
      component: ListaProductosComponent,
      translucent: true
    });
    return await popover.present();
  }
  formatDate(date:string){
    console.log(date)
    return moment(date).add(3, 'h').format('HH:mm:ss');
  }

}
