import { Component, OnInit, ViewChild, Input, ElementRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { ModalController, LoadingController } from '@ionic/angular';
import { DetallesPedidoComponent } from '../detalles-pedido/detalles-pedido.component';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import Axios from 'axios';
import { LoginService } from '../service/login.service';
import { PedidoService } from '../service/pedido.service';

declare var H: any;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

   

  @Input()
  public appCode: any;


  constructor(public http : HttpClient,
    private storage: Storage,
    public modalController: ModalController,
    public loadingController: LoadingController,
    public loginService:LoginService,
    public pedidoService:PedidoService
    ) {  }
  public axios = Axios
  public token :any;
  public name : string;
  public pedidos;
  public showContent:boolean 
  ngOnInit(){
    this.storage.get('token')
    .then( (data) =>{
      (data != null)?this.pedidoService.setPedidos(data):this.loginService.abrirLogin()
      console.log(this.pedidoService.pedidos)
    })
    this.storage.get('token')
    .then( (data) =>{
      (data != null)?this.token = data.token:console.log("sin token")
    })
    }

  ngAfterViewInit() {
  }
  async initLoading(){
    const loading = await this.loadingController.create({
      message: 'Cargando',
    });
    await loading.present();
  }
  rechargeToken(token){
    this.token = token;
  }
  async mostrarDetalles(){
    const modal = await this.modalController.create({
      component: DetallesPedidoComponent,
      mode:"ios" 
    });
    return await modal.present();
  }
  async cargarPedidos(){
    window.location.reload();
  }
}
