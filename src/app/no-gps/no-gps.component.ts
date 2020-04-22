import { Component, OnInit } from '@angular/core';
import { PedidoService } from '../service/pedido.service';

@Component({
  selector: 'app-no-gps',
  templateUrl: './no-gps.component.html',
  styleUrls: ['./no-gps.component.scss'],
})
export class NoGpsComponent implements OnInit {

  constructor( public pedidoService: PedidoService) { }

  ngOnInit() {}

}
