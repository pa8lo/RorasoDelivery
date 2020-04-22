import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';
import { LoginComponent } from './login/login.component';
import { FormsModule }   from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { DetallePedidoPage } from './detalle-pedido/detalle-pedido.page';
import { DetallesPedidoComponent } from './detalles-pedido/detalles-pedido.component';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { HomePageModule } from './home/home.module';



@NgModule({
  declarations: [
    AppComponent,
    ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    HomePageModule,
    AppRoutingModule,
    HttpClientModule,

    
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation ,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent],
  entryComponents:[]

})
export class AppModule {}
