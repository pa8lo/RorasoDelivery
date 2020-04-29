import { Component, OnInit, Input } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import * as moment from 'moment';
import { DetallesComponent } from '../detalles/detalles.component';

@Component({
  selector: 'app-listapedidos',
  templateUrl: './listapedidos.component.html',
  styleUrls: ['./listapedidos.component.scss'],
})
export class ListapedidosComponent implements OnInit {


  constructor(public modalController:ModalController) {
  }
  @Input("pedidos") pedidos;
  @Input("estado") estado;
  @Input("image") image;
  @Input("color") color;
  public background ='EnCurso.PNG';
  ngOnInit() {
    this.background= this.image;
    console.log(this.pedidos)
    console.log(this.estado)
  }
  formatDate(date:string){
    return moment(date).add(3, 'h').format('YYYY-MM-DD HH:mm:ss');
  }

  async abrirdetalles(pedido:any){
    const modal = await this.modalController.create({
      component: DetallesComponent,
      componentProps: {
        pedido: pedido
      }
    });
    return await modal.present();
  }
}
