import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { HomePageModule } from '../home/home.module';
import { ModalController, LoadingController, ToastController } from '@ionic/angular';
import { HomePage } from '../home/home.page';
import { loadingController } from '@ionic/core';
import Axios from 'axios';
import { PedidoService } from '../service/pedido.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  public todo : FormGroup;
  public token;
  public axios = Axios
  public pedidos;
  public modalInput;
  constructor( private formBuilder: FormBuilder,
    public http : HttpClient,
    private storage: Storage,
    public loadingController: LoadingController,
    public modalController: ModalController,
    public toastController: ToastController,
    public pedidoService : PedidoService) {
    this.todo = this.formBuilder.group({
      Dni: ['', Validators.required],
      Password: ['', Validators.required],
    });
  }
  ngOnInit() {}

  initApp(){
    this.storage.get('token')
    .then((data) => {
      this.token = data,
      this.checkLogin()
    })
  }

  async initLoading(){
    const loading = await this.loadingController.create({
      message: 'Iniciando sesión',
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
      this.axios
      .get('https://rorasobackend.herokuapp.com/Pedido/Delivery',
      {headers:{'access-token' : this.token.token}}
      ).then( (data)=>{
        this.pedidos = data.data
        this.loadingController.dismiss()
        console.log(this.pedidos)
      })
      .catch((err) =>{
        this.storage.remove('token');
        return false
      })
    }
  }
  login(Password:string,Dni:string){
    this.initLoading()
      var user = this.http.post('https://rorasobackend.herokuapp.com/User/Login',
      {Dni: this.todo.value.Dni, Password: this.todo.value.Password})
          user.subscribe( res => {
            this.token = res
            this.storage.set('token', res).then(()=>{
              this.pedidoService.setPedidos(this.token).then(() => {
                this.loadingController.dismiss().then(() => {
                  this.cerrarLogin()
                })
              })
            })
        },
        error => {
          this.errorToast("Credenciales Invalidas")
          this.storage.remove('token');
          return false
      })
  }
  async errorToast(message:string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }
}
