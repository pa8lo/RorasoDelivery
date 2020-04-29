import { Component, OnInit, ViewChild, Input, ElementRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { ModalController, LoadingController, ToastController } from '@ionic/angular';
import { DetallesPedidoComponent } from '../detalles-pedido/detalles-pedido.component';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import Axios from 'axios';
import { PedidoService } from '../service/pedido.service';
import { LoginService } from '../service/login.service';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.scss'],
})
export class PrincipalComponent implements OnInit {

  constructor(public http : HttpClient,
    private storage: Storage,
    public modalController: ModalController,
    private geolocation: Geolocation,
    public toastController: ToastController,
    public loginService:LoginService,
    public loadingController: LoadingController,
    public pedidoService:PedidoService
    ) {  }
    public map: any;
    public axios = Axios
    public token :any;
    public name : string;
    public pedidos;
    ngOnInit(){
      this.storage.get('token')
        .then( (data) => this.token =  data)
        .then( ()=> {
          this.axios.get('https://rorasobackend.herokuapp.com/User/CurrentUser',
          {headers:{'access-token' : this.token.token}})
          .then(() => {
            this.axios
            .get('https://rorasobackend.herokuapp.com/Pedido/Delivery',
            {headers:{'access-token' : this.token.token}}
            ).then( (data)=>{
              this.pedidos = data.data
              this.loadingController.dismiss()
              console.log(this.pedidos)
            })
            .catch((err) =>{
              this.errorToast("Su sesión expiro")
              this.storage.remove('token');
              return false
            })
          })
          .catch((err) =>{
            this.errorToast("Su sesión expiro")
            this.storage.remove('token');
            this.loginService.abrirLogin();
            return false
          })
        })
      }
      async initLoading(){
        const loading = await this.loadingController.create({
          message: 'Cargando',
        });
        await loading.present();
      }
    ngAfterViewInit() {
      console.log("pedidos"+this.pedidos)
      this.storage.get('token')
      .then( (data) => this.token =  data)
      .then( ()=> {
        this.axios
        .get('https://rorasobackend.herokuapp.com/Pedido/Delivery',
        {headers:{'access-token' : this.token.token}}
        ).then( (data)=>{
          console.log("informaci")
          this.pedidos = data.data
          console.log(this.pedidos)
        })
        .catch((err) =>{
          this.storage.remove('token');
          return false
        })
      })
      console.log("pedidos"+this.pedidos)
    }
    pedidoEntregado(){
      this.initLoading().then(()=>{
        this.axios
        .post('https://rorasobackend.herokuapp.com/Pedido/Entregado',{id:this.pedidos[0].id}
        )
      .then(()=>{
          this.cargarPedidos()
            .then(()=>this.loadingController.dismiss())
            // .catch((error)=> {
            //   this.loadingController.dismiss()
            //   alert(error)
            // })
        })
        // .catch((error)=>{
        //   this.loadingController.dismiss()
        //   alert(error)
        // })
      })
      
    }
    pedidoRechazado(){
      this.initLoading().then(()=>{
        this.axios
        .post('https://rorasobackend.herokuapp.com/Pedido/Rechazado',{id:this.pedidos[0].id}
        )
      .then(()=>{
          this.cargarPedidos()
            .then(()=>this.loadingController.dismiss())
            // .catch(()=> {
            //   alert("Existio un problema para enviar el mensaje verifique su conexión")
            // })
        })
        // .catch(()=>{
        //   alert("Existio un problema para enviar el mensaje verifique su conexión")
        // })
      })
    }
    rechargeToken(token){
      this.token = token;
    }
    async cargarPedidos(){
      await this.axios
      .get('https://rorasobackend.herokuapp.com/Pedido/Delivery',
      {headers:{'access-token' : this.token.token}}
      ).then( (data)=>{
        console.log("informaci")
        this.pedidos = data.data
        this.pedidoService.pedidos = this.pedidos
        this.pedidoService.newRefreshPedidos()
        console.log(this.pedidos)
      })
    }
    async mostrarDetalles(index){
      console.log("pedidos")
      console.log(this.pedidos)
      const modal = await this.modalController.create({
        component: DetallesPedidoComponent,
        componentProps: { value: this.pedidos[index]},
        mode:"ios" 
      });
      return await modal.present();
    }
    onClick(){
     this.map.removeObjects(this.map.getObjects())
    }
    async errorToast(message:string) {
      const toast = await this.toastController.create({
        message: message,
        duration: 2000
      });
      toast.present();
    }
    

}
