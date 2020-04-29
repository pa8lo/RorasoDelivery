import { Injectable, ViewChild, ElementRef } from '@angular/core';
import { LoginService } from './login.service';
import Axios from 'axios';
import { Storage } from '@ionic/storage';
import { LoadingController, ToastController, AlertController } from '@ionic/angular';
import { loadingController } from '@ionic/core';
import { Alert } from 'selenium-webdriver';
import { Geolocation } from '@ionic-native/geolocation/ngx';

declare var H: any;

@Injectable({
  providedIn: 'root'
})

export class PedidoService {
  public mapElement: ElementRef;
  public pedidosSinFiltrar: any;
  public pedidos:any = [];
  public gps = true;
  public pedido:any;
  public map:any;
  public token:any;
  public platform:any;
  public lat: any;
  public lng: any;
  public axios = Axios
  public horarioEntrega :any = {
     hora:0,
     minutos:0,
     segundos:0
   }
  public recibidos: any = [];
  public entregados: any = [];
  public rechazados: any = [];
  public asistencias: any = [];
  public enviados: any = [];
  constructor(    private storage: Storage,public alertController: AlertController,
    private geolocation: Geolocation ,public loadingController: LoadingController,public toastController: ToastController,) { 
    

  }
  ngOnInit() {
    
  }
  reloadGps(){
    this.geolocation.getCurrentPosition().then(() =>{
      this.gps = true
    })
    .catch( () => {
      this.gps = false
    })
    
  }
  executeHereMaps(mapElement : ElementRef){
    this.mapElement = mapElement
    this.initLoading("Cargando Gps");
    this.geolocation.getCurrentPosition().then((resp) => {
      this.loadingController.dismiss()
      this.initLoading("Cargando Mapa")
      this.lat = resp.coords.latitude
      this.lng = resp.coords.longitude
      this.platform = new H.service.Platform({
        "app_id": '8F1ekHrYnO9KrpdHrJRS',
        "app_code": 'b2XcYw0WhXrsjjK4m4SAJg'
    })
    if(this.pedidos[0]){
      this.pedidos = this.pedidos[0].Adress.LatLong.split(";")
    this.newHereMaps()
    }
  }).catch( (err) =>{
    this.loadingController.dismiss()
    this.gps = false
  })
  }
  newHereMaps(){
    let defaultLayers = this.platform.createDefaultLayers()
    this.map = new H.Map(
      this.mapElement.nativeElement,
      defaultLayers.normal.map,
      {
          zoom: 15,
          center: {lat:this.lat,lng:this.lng},
          animated:true
      }
    );
    let routingParameters = {
      // The routing mode:
      'mode': 'fastest;car;traffic:enabled',
      // The start point of the route:
      'waypoint0': 'geo!'+String(this.lat)+','+String(this.lng),
      // The end point of the route:
      'waypoint1': 'geo!'+this.pedidos[0]+','+this.pedidos[1],
      // To retrieve the shape of the route we choose the route
      // representation mode 'display'
      'representation': 'navigation',
    };
    var router = this.platform.getRoutingService();
      var icon = new H.map.Icon("http://www.abmeat.com/images/single/free.png", {size: {w: 32, h: 32}})

      // Create a marker for the start point:
      var startMarker = new H.map.Marker({
        lat: this.lat,
        lng: this.lng
        },{icon: icon});
        this.map.addObjects([startMarker]);
      let watch = this.geolocation.watchPosition();
        watch.subscribe((data) => {
          this.lat = data.coords.latitude
          this.lng = data.coords.longitude
          this.map.removeObjects([startMarker])
          startMarker = new H.map.Marker({
            lat: this.lat,
            lng: this.lng
            });
            this.map.addObjects([startMarker]);
        });


      router.calculateRoute(routingParameters,((x)=> { this.onResult(x) }),
      function(error) {
        this.errorToast("Existio un problema para iniciar el mapa, Verifique su red, y su tener el gps activo");
      });

    let behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(this.map))
    return behavior;
  }
  onResult(result) {
    var route,
    routeShape,
    startPoint,
    endPoint,
    linestring;
    if(result.response.route) {
      loadingController.dismiss()
    // Pick the first route from the response:
    route = result.response.route[0];
    // Pick the route's shape:
    routeShape = route.shape;
    var fecha = new Date(Date.now())
    console.log(fecha)
    let segundosParaLaEntrega = route.leg[0].trafficTime
    segundosParaLaEntrega = segundosParaLaEntrega+ fecha.getHours() *60*60 + fecha.getMinutes()*60 + fecha.getSeconds()
    this.horarioEntrega.hora = Math.floor(segundosParaLaEntrega/60/60)
    this.horarioEntrega.minutos = Math.floor(segundosParaLaEntrega/60%60)  
    this.horarioEntrega.segundos =Math.floor(segundosParaLaEntrega%60)
    // Create a linestring to use as a point source for the route line
    linestring = new H.geo.LineString();
  
    // Push all the points in the shape into the linestring:
    routeShape.forEach(function(point) {
    var parts = point.split(',');
    linestring.pushLatLngAlt(parts[0], parts[1]);
    });
    // Retrieve the mapped positions of the requested waypoints:
    endPoint = route.waypoint[1].mappedPosition;
   
    // Create a polyline to display the route:
    var routeLine = new H.map.Polyline(linestring, {
      style: {
        lineWidth: 10,
        fillColor: 'white',
        strokeColor: 'rgba(255, 255, 255, 1)',
        lineDash: [0, 2],
        lineTailCap: 'arrow-tail',
        lineHeadCap: 'arrow-head' }
        }      
        );
        var routeOutline = new H.map.Polyline(linestring, {
          style: {
          lineWidth: 10,
          strokeColor: 'rgba(0, 128, 255, 0.7)',
          lineTailCap: 'arrow-tail',
          lineHeadCap: 'arrow-head'
          }
        });
        
  
    // Create a marker for the end point:
    var endMarker = new H.map.Marker({
    
    lat: endPoint.latitude,
    lng: endPoint.longitude,
    
    });

    // Add the route polyline and the two markers to the map:
      this.map.addObjects([routeLine,routeOutline, endMarker]);
    // Set the map's viewport to make the whole route visible:
    // map.getViewModel().setLookAtData({bounds: routeLine.getBoundingBox()});
    // startMarker.setPosition({ lat: -34.5691263, lng: -58.4776159 });
    }
  };
  // hereMaps(horarioEntrega,mapElement:any,geolocation:any,pedido:any,platforma:any,latitud,longitud){
  //   this.platform = new H.service.Platform({
  //     "app_id": '8F1ekHrYnO9KrpdHrJRS',
  //     "app_code": 'b2XcYw0WhXrsjjK4m4SAJg'
  // });
  //   console.log(JSON.stringify(pedido))
  //   if(pedido[0] == 'latlong'){
  //     pedido[0] = latitud
  //     pedido[1] = longitud
  //   }
  //   this.initLoading("Cargando Mapa")
  //   this.geolocation=geolocation
  //   this.lat=latitud;
  //   this.lng =longitud;
  //   // this.platform = platforma;
  //   this.pedidos = pedido;
  //   let platform = this.platform
  //   let defaultLayers = platform.createDefaultLayers()
  //   let map = new H.Map(
  //     mapElement.nativeElement,
  //     defaultLayers.normal.map,
  //     {
  //         zoom: 15,
  //         center: {lat:this.lat,lng:this.lng},
  //         animated:true
  //     }
  //   );
  //   console.log(this.pedidos[0])
  //   var routingParameters = {
  //     // The routing mode:
  //     'mode': 'fastest;car;traffic:enabled',
  //     // The start point of the route:
  //     'waypoint0': 'geo!'+String(this.lat)+','+String(this.lng),
  //     // The end point of the route:
  //     'waypoint1': 'geo!'+this.pedidos[0]+','+this.pedidos[1],
  //     // To retrieve the shape of the route we choose the route
  //     // representation mode 'display'
  //     'representation': 'navigation',
  //   };
  //   let loadingController = this.loadingController;
  //   // Define a callback function to process the routing response:
  //   var onResult = function(result) {
  //     var route,
  //     routeShape,
  //     startPoint,
  //     endPoint,
  //     linestring;
  //     console.log(result)
  //     if(result.response.route) {
  //       loadingController.dismiss()
  //       console.log(result)
  //     // Pick the first route from the response:
  //     route = result.response.route[0];
  //     // Pick the route's shape:
  //     routeShape = route.shape;
  //     var fecha = new Date(Date.now())
  //     console.log(fecha)
  //     let segundosParaLaEntrega = route.leg[0].trafficTime
  //     segundosParaLaEntrega = segundosParaLaEntrega+ fecha.getHours() *60*60 + fecha.getMinutes()*60 + fecha.getSeconds()
  //     horarioEntrega.hora = Math.floor(segundosParaLaEntrega/60/60)
  //     horarioEntrega.minutos = Math.floor(segundosParaLaEntrega/60%60)  
  //     horarioEntrega.segundos =Math.floor(segundosParaLaEntrega%60)
  //     // Create a linestring to use as a point source for the route line
  //     linestring = new H.geo.LineString();
    
  //     // Push all the points in the shape into the linestring:
  //     routeShape.forEach(function(point) {
  //     var parts = point.split(',');
  //     linestring.pushLatLngAlt(parts[0], parts[1]);
  //     });
  //     // Retrieve the mapped positions of the requested waypoints:
  //     endPoint = route.waypoint[1].mappedPosition;
     
  //     // Create a polyline to display the route:
  //     var routeLine = new H.map.Polyline(linestring, {
  //       style: {
  //         lineWidth: 10,
  //         fillColor: 'white',
  //         strokeColor: 'rgba(255, 255, 255, 1)',
  //         lineDash: [0, 2],
  //         lineTailCap: 'arrow-tail',
  //         lineHeadCap: 'arrow-head' }
  //         }      
  //         );
  //         var routeOutline = new H.map.Polyline(linestring, {
  //           style: {
  //           lineWidth: 10,
  //           strokeColor: 'rgba(0, 128, 255, 0.7)',
  //           lineTailCap: 'arrow-tail',
  //           lineHeadCap: 'arrow-head'
  //           }
  //         });
          
    
  //     // Create a marker for the end point:
  //     var endMarker = new H.map.Marker({
      
  //     lat: endPoint.latitude,
  //     lng: endPoint.longitude,
      
  //     });

  //     // Add the route polyline and the two markers to the map:
  //       map.addObjects([routeLine,routeOutline, endMarker]);
  //     // Set the map's viewport to make the whole route visible:
  //     // map.getViewModel().setLookAtData({bounds: routeLine.getBoundingBox()});
  //     // startMarker.setPosition({ lat: -34.5691263, lng: -58.4776159 });
  //     }
  //   };
    
  //   // Get an instance of the routing service:
    
    
  //   // Call calculateRoute() with the routing parameters,
  //   // the callback and an error callback function (called if a
  //   // communication error occurs):
  //     var router = platform.getRoutingService();
  //     var icon = new H.map.Icon("http://www.abmeat.com/images/single/free.png", {size: {w: 32, h: 32}})

  //     // Create a marker for the start point:
  //     var startMarker = new H.map.Marker({
  //       lat: this.lat,
  //       lng: this.lng
  //       },{icon: icon});
  //       map.addObjects([startMarker]);
  //     let watch = geolocation.watchPosition();
  //       watch.subscribe((data) => {
  //         this.lat = data.coords.latitude
  //         this.lng = data.coords.longitude
  //         map.removeObjects([startMarker])
  //         startMarker = new H.map.Marker({
  //           lat: this.lat,
  //           lng: this.lng
  //           });
  //           map.addObjects([startMarker]);
  //       });


  //     router.calculateRoute(routingParameters, onResult,
  //     function(error) {
  //       this.errorToast("Existio un problema para iniciar el mapa, Verifique su red, y su tener el gps activo");
  //     });
  //   this.map=map  
  //   let behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map))
  //   return behavior;
  // }
  newRefreshPedidos(){
    if(this.pedidos[0]){
      this.initLoading("Cargando Mapa")
      this.pedidos = this.pedidos[0].Adress.LatLong.split(";")
    var router = this.platform.getRoutingService();
    this.map.removeObjects(this.map.getObjects ())
    var startMarker = new H.map.Marker({
      lat: this.lat,
      lng: this.lng
      });
      this.map.addObjects([startMarker]);
      let watch = this.geolocation.watchPosition();
      watch.subscribe((data) => {
        this.lat = data.coords.latitude
        this.lng = data.coords.longitude
        this.map.removeObjects([startMarker])
        startMarker = new H.map.Marker({
          lat: this.lat,
          lng: this.lng
          });
          this.map.addObjects([startMarker]);
      });
      let routingParameters = {
        // The routing mode:
        'mode': 'fastest;car;traffic:enabled',
        // The start point of the route:
        'waypoint0': 'geo!'+String(this.lat)+','+String(this.lng),
        // The end point of the route:
        'waypoint1': 'geo!'+this.pedidos[0]+','+this.pedidos[1],
        // To retrieve the shape of the route we choose the route
        // representation mode 'display'
        'representation': 'navigation',
      };
      router.calculateRoute(routingParameters,((x)=> { this.onResult(x) }),
      function(error) {
        this.errorToast("Existio un problema para iniciar el mapa, Verifique su red, y su tener el gps activo");
      });
    }

  }
  refreshPedidos(pedidos:any){
      this.pedidos=pedidos;
      // this.map.removeObjects(this.map.getObjects ())
      var router = this.platform.getRoutingService();
      var icon = new H.map.Icon("http://www.abmeat.com/images/single/free.png", {size: {w: 32, h: 32}})
      var startMarker = new H.map.Marker({
        lat: this.lat,
        lng: this.lng
        },{icon: icon});
        this.map.addObjects([startMarker]);
      let watch = this.geolocation.watchPosition();
        watch.subscribe((data) => {
          this.lat = data.coords.latitude
          this.lng = data.coords.longitude
          this.map.removeObjects([startMarker])
          startMarker = new H.map.Marker({
            lat: this.lat,
            lng: this.lng
            });
            this.map.addObjects([startMarker]);
        });
        let actualizarMapa = function(result,map,horarioEntrega) {
          var route,
          routeShape,
          startPoint,
          endPoint,
          linestring;
          console.log(result)
          if(result.response.route ) {
            console.log(result)
          // Pick the first route from the response:
          route = result.response.route[0];
          // Pick the route's shape:
          routeShape = route.shape;
          var fecha = new Date(Date.now())
          console.log(fecha)
          let segundosParaLaEntrega = route.leg[0].trafficTime
          segundosParaLaEntrega = segundosParaLaEntrega+ fecha.getHours() *60*60 + fecha.getMinutes()*60 + fecha.getSeconds()
          horarioEntrega.hora = Math.floor(segundosParaLaEntrega/60/60)
          horarioEntrega.minutos = Math.floor(segundosParaLaEntrega/60%60)  
          horarioEntrega.segundos =Math.floor(segundosParaLaEntrega%60)
          // Create a linestring to use as a point source for the route line
          linestring = new H.geo.LineString();
        
          // Push all the points in the shape into the linestring:
          routeShape.forEach(function(point) {
          var parts = point.split(',');
          linestring.pushLatLngAlt(parts[0], parts[1]);
          });
          // Retrieve the mapped positions of the requested waypoints:
          endPoint = route.waypoint[1].mappedPosition;
         
          // Create a polyline to display the route:
          var routeLine = new H.map.Polyline(linestring, {
            style: {
              lineWidth: 10,
              fillColor: 'white',
              strokeColor: 'rgba(255, 255, 255, 1)',
              lineDash: [0, 2],
              lineTailCap: 'arrow-tail',
              lineHeadCap: 'arrow-head' }
              }      
              );
              var routeOutline = new H.map.Polyline(linestring, {
                style: {
                lineWidth: 10,
                strokeColor: 'rgba(0, 128, 255, 0.7)',
                lineTailCap: 'arrow-tail',
                lineHeadCap: 'arrow-head'
                }
              });
              
        
          // Create a marker for the end point:
          var endMarker = new H.map.Marker({
          
          lat: endPoint.latitude,
          lng: endPoint.longitude,
          
          });
    
          // Add the route polyline and the two markers to the map:
            map.addObjects([routeLine,routeOutline, endMarker]);
          
          
        
          // Set the map's viewport to make the whole route visible:
          // map.getViewModel().setLookAtData({bounds: routeLine.getBoundingBox()});
          // startMarker.setPosition({ lat: -34.5691263, lng: -58.4776159 });
          }
        };
        console.log("Actualizar Pedido")
        console.log(this.pedidos)
        let latitud =  (this.pedidos > 0) ?this.pedidos[0].Adress.LatLong.split(";"):[String(this.lat),String(this.lng)]
        var routingParameters = {
          // The routing mode:
          'mode': 'fastest;car;traffic:enabled',
          // The start point of the route:
          'waypoint0': 'geo!'+String(this.lat)+','+String(this.lng),
          // The end point of the route:
          'waypoint1': 'geo!'+latitud[0]+','+latitud[1],
          // To retrieve the shape of the route we choose the route
          // representation mode 'display'
          'representation': 'navigation',
        };
        router.calculateRoute(routingParameters,
          x => actualizarMapa(x,this.map,this.horarioEntrega),
          function(error) {
            this.errorToast("Existio un problema para iniciar el mapa, Verifique su red, y su tener el gps activo");          
          });  
    }
    async setPedidos(token){
      this.loadingController.dismiss();
      this.initLoading("Cargando pedidos");
        await this.axios
        .get('https://rorasobackend.herokuapp.com/Pedido/Delivery',
        {headers:{'access-token' : token.token}}
        ).then( (data)=>{
          this.token = token;
          this.pedidos = data.data
          loadingController.dismiss()
        })
        .catch((err) =>{
          loadingController.dismiss()
        })
      }
      async setReport(token){
        console.log("Cargando Reportes")
        console.log(token)
        this.initLoading("Cargando reporte");
        this.axios.get('https://rorasobackend.herokuapp.com/User/CurrentUser',
        {headers:{'access-token' : this.token.token}})
        .then( async () => {
          await this.axios
          .get('https://rorasobackend.herokuapp.com/Pedido/DeliveryAll',
          {headers:{'access-token' : token.token}}
          ).then( (data)=>{
            console.log("Reportes cargados")
            console.log(data.data)
            this.token = token
            this.pedidosSinFiltrar = data.data
            this.setBadge(this.pedidosSinFiltrar)
            this.axios
          .get('https://rorasobackend.herokuapp.com/Asisstance/AssistByJwT',
          {headers:{'access-token' : token.token}}
          ).then( (data) => {
            this.asistencias = data.data[0].Assistance
            console.log(this.asistencias)
            loadingController.dismiss()
          })
          .catch( (err) =>{
            console.log(err)
            loadingController.dismiss()
            })
          })
          .catch((err) =>{
            loadingController.dismiss()
          })
        }).catch( () =>{
          loadingController.dismiss()
          alert("Su sesión expiro")
          this.storage.remove('token');
          window.location.replace('/');
          return false
        })

        }
    setBadge(data : any){
      console.log("cargando valores")
      console.log(data)
      this.recibidos = data.filter(pedido =>  pedido.State.Description !='Rechazado' && pedido.State.Description !='Entregado' && pedido.State.Description !='Enviado')
      this.entregados = data.filter(pedido =>  pedido.State.Description =='Entregado')
      this.rechazados = data.filter(pedido => pedido.State.Description =='Rechazado' )
      this.enviados = data.filter(pedido => pedido.State.Description =='Enviado' )
    }
    
    async initLoading(message:string){
      const loading = await this.loadingController.create({
        message: message,
      });
      await loading.present();
    }
    async errorToast(message:string) {
      const toast = await this.toastController.create({
        message: message,
        duration: 2000
      });
      toast.present();
    }
    async presentAlertConfirm() {
      const alert = await this.alertController.create({
        header: 'UPS!',
        message: ' <strong>sesión expirada</strong>!!!',
        backdropDismiss: false,
        buttons: [
           {
            text: 'Iniciar sesión',
            handler: () => {
              window.location.reload();
            }
          }
        ]
      });
      alert.present()
    }
}
