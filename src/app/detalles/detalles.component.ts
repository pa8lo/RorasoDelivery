import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-detalles',
  templateUrl: './detalles.component.html',
  styleUrls: ['./detalles.component.scss'],
})
export class DetallesComponent implements OnInit {
  @Input("pedido") pedido;
  public detallePedido: any;
  
  constructor() {
  }

  ngOnInit() {
    this.detallePedido = this.pedido
  }

}
