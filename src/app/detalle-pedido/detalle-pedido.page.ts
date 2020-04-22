import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-detalle-pedido',
  templateUrl: './detalle-pedido.page.html',
  styleUrls: ['./detalle-pedido.page.scss'],
})
export class DetallePedidoPage implements OnInit {
  public pedido;
  constructor( ) { }

  ngOnInit() {
    this.pedido = {
      address: {
        address : "bogota 2376",
        floor: "1",
        deparment:"frente"
      },
      Users:{
        name:"pablo",
        lastName:"Rozek"
      },
      Clients:{
        name:"juan",
        lastName:"perez"
      },
      Products:[
        {
        name:"pizza muzzarella"
        },
        {
        name:"pizza napolitana"
        },
        {
        name:"pizzareza"
        },
    
      ],
      Offers:[
        {
        name:"combo 1"  
        }
      ],
      id:124532,
      amount:253
    }
  }

}
