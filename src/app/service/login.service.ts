import { Injectable } from '@angular/core';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import Axios from 'axios';
import { LoginComponent } from '../login/login.component';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class LoginService {
  public token;
  public axios = Axios
  public pedidos;
  public modalInput;
  constructor(
    private storage: Storage,
    public loadingController: LoadingController,
    public modalController: ModalController,
    public http :HttpClient,
    public toastController: ToastController
    ) { }
    initApp(){
      this.storage.get('token')
      .then((data) => {
        this.token = data,
        this.checkLogin()
      })
    }

    async initLoading(){
      const loading = await this.loadingController.create({
        message: 'Cargando',
      });
      await loading.present();
    }

    async cerrarLogin(){
      this.modalController.dismiss()
    }

    async abrirLogin(){
      this.modalInput = await this.modalController.create({
        component: LoginComponent,
        backdropDismiss:false
      });
      return await this.modalInput.present();
    }

    checkLogin(){
      if(this.token == null){
        console.log("sin token"+this.token)
        this.abrirLogin()
      }else{
        console.log("con token"+this.token)
        this.initLoading().then(()=>{
        this.axios
        .get('https://rorasobackend.herokuapp.com/Pedido/Delivery',
        {headers:{'access-token' : this.token.token}}
        ).then( (data)=>{
          this.pedidos = data.data
          console.log(this.pedidos)
        })
        .catch((err) =>{
          this.storage.remove('token');
          return false
        })
      }).then(()=> {
        let  loading = this.loadingController.dismiss()
      }).catch( (error)=>{
        console.log(error)
        let  loading = this.loadingController.dismiss()
      } )
      }
    }
    login(Password:string,Dni:string){
      this.initLoading().then(()=> {
        var user = this.http.post('https://rorasobackend.herokuapp.com/User/Login',
        {Dni: Dni, Password: Password})
            user.subscribe( res => {
              this.token = res
              this.storage.set('token', res).then(()=>{
                this.loadingController.dismiss()
                this.cerrarLogin()
              })
          },
          error => {
            this.errorToast("Credenciales Invalidas")
            this.storage.remove('token');
            return false
        })
      } )
    }
    async errorToast(message:string) {
      const toast = await this.toastController.create({
        message: message,
        duration: 2000
      });
      toast.present();
    }

}
