import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-asistencias',
  templateUrl: './asistencias.page.html',
  styleUrls: ['./asistencias.page.scss'],
})
export class AsistenciasPage implements OnInit {
  public pedidos;
  constructor() { }

  ngOnInit() {
    this.pedidos=[{
      user:{
        Assistence:[
            {
              createdAt: 1570312340651,
              updatedAt: 1570312340651,
              id: 1,
              InTime: "2019-10-22T17:00:00.000Z",
              OutTime: "2019-10-22T17:00:00.000Z",
              Hours: 5,
              Minutes: 1,
              Eliminated: false
            },
            {
              createdAt: 1570312340651,
              updatedAt: 1570312340651,
              id: 2,
              InTime: "2019-10-23T17:00:00.000Z",
              OutTime: "2019-10-22T17:00:00.000Z",
              Hours: 4,
              Minutes: 1,
              Eliminated: false
            },
            {
              createdAt: 1570312340651,
              updatedAt: 1570312340651,
              id: 3,
              InTime: "2019-10-24T17:00:00.000Z",
              OutTime: "2019-10-22T17:00:00.000Z",
              Hours: 8,
              Minutes: 1,
              Eliminated: false
            },
          ],
      }
    }]
  }

}
