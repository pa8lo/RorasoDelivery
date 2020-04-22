import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { PedidoService } from '../service/pedido.service';
import { Storage } from '@ionic/storage';
import { LoginService } from '../service/login.service';
import { DetallesComponent } from '../detalles/detalles.component';
import { ModalController } from '@ionic/angular';
import { ListapedidosComponent } from '../listapedidos/listapedidos.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  public pedidos;
  public profile;
  public asistencia;
  constructor(
    public pedidosService: PedidoService,
    public storage: Storage,
    public loginService:LoginService,
    public modalController: ModalController
    ) {
    
  }

  ngOnInit() {
    this.storage.get('token')
    .then( (data) => (data != null)?this.pedidosService.setReport(data):this.loginService.abrirLogin())
    this.profile = {
      src: "EnCurso.PNG",
      name:"Lionel",
      lastName:"Messi"
    };
    this.asistencia ={
      date : new Date('2019-10-22T17:00:00.000Z'),
      horas: 2,
      minutos: 30
    }
    this.asistencia.date = moment(this.asistencia.date).calendar()
    console.log("pedidos entregados")
    
  }
  Entregados(){
    this.mostrarDetalles(this.pedidosService.entregados,"Entregado","Enviado.PNG","success")
  }
  EnCurso(){
    this.mostrarDetalles(this.pedidosService.recibidos,"Asignados","recibido.PNG","warning")
  }
  Rechazados(){
    this.mostrarDetalles(this.pedidosService.rechazados,"Rechazados","Rechazado.PNG","danger")
  }
  Enviado(){
    this.mostrarDetalles(this.pedidosService.enviados,"En Curso","EnCurso.PNG","primary")
  }

  async mostrarDetalles(index,estado,image,color){
    const modal = await this.modalController.create({
      component: ListapedidosComponent,
      componentProps: { pedidos: index,estado:estado,image:image,color:color},
      mode:"ios" 
    });
    return await modal.present();
  }
  parseDate(date){
    return moment(date).format('YYYY-MM-DD HH:mm');
  }
  formatTime(date){
    console.log(date)
    moment('2019-10-22T17:00:00.000Z').format('YYYY-MM-DD HH:mm:ss');
  }
}
