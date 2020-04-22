import { Component, OnInit, ElementRef, ViewChild, Input, Output } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { PrincipalComponent } from '../principal/principal.component';
import { PedidoService } from '../service/pedido.service';
declare var H: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})

export class MapComponent implements OnInit {
  @ViewChild("map",{static:false})
  public mapElement: ElementRef;
  @Input()
  public Pedidos: any;
   // @Input()

  public pedido:any;
  public map:any;
  public platform:any;
   // @Input()
   public lat: any;
   public lng: any;
   public horarioEntrega :any = {
     hora:0,
     minutos:0,
     segundos:0
   }

  constructor(private geolocation: Geolocation , public parent : PrincipalComponent,
    public pedidosService :PedidoService) {}

  ngOnInit() {
    if(this.pedidosService.pedidos[0]){
      this.pedido = this.pedidosService.pedidos[0].Adress.LatLong.split(";")
    }
  }

  ngAfterViewInit() {
    // console.log("Arranco 1")
    // this.geolocation.getCurrentPosition().then((resp) => {
    //   this.lat = resp.coords.latitude
    //   this.lng = resp.coords.longitude
    //   this.platform = new H.service.Platform({
    //     "app_id": '8F1ekHrYnO9KrpdHrJRS',
    //     "app_code": 'b2XcYw0WhXrsjjK4m4SAJg'
    // })
    //   let a  = this.pedidosService.hereMaps(this.horarioEntrega,this.mapElement,this.geolocation,this.pedido,this.platform,this.lat,this.lng)
    //  }).catch((err) => {
    //   this.pedidosService.errorToast("No se detecto señal gps,verifique que este encendido")
    // });
    this.pedidosService.executeHereMaps(this.mapElement)
    
  }

  // hereMaps(horarioEntrega){
  //   let platform = this.platform
  //   let defaultLayers = platform.createDefaultLayers();
  //   let map = new H.Map(
  //     this.mapElement.nativeElement,
  //     defaultLayers.normal.map,
  //     {
  //         zoom: 15,
  //         center: {lat:this.lat,lng:this.lng},
  //         animated:true
  //     }
  //   );
  //   var routingParameters = {
  //     // The routing mode:
  //     'mode': 'fastest;car;traffic:enabled',
  //     // The start point of the route:
  //     'waypoint0': 'geo!'+String(this.lat)+','+String(this.lng),
  //     // The end point of the route:
  //     'waypoint1': 'geo!'+this.pedido[0],
  //     // To retrieve the shape of the route we choose the route
  //     // representation mode 'display'
  //     'representation': 'navigation',
  //   };
    
  //   // Define a callback function to process the routing response:
  //   var onResult = function(result) {
  //     var route,
  //     routeShape,
  //     startPoint,
  //     endPoint,
  //     linestring;
  //     console.log(result)
  //     if(result.response.route) {
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
  //     let watch = this.geolocation.watchPosition();
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
  //     alert(error.message);
      
  //     });  
  //   this.parent.map = map
  //   let behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map))
  //   return behavior;
  // }
  //   onClick(){
  //     this.map.removeObjects(this.map.getObjects ())
  //     var router = this.platform.getRoutingService();
  //     var icon = new H.map.Icon("http://www.abmeat.com/images/single/free.png", {size: {w: 32, h: 32}})
  //     var startMarker = new H.map.Marker({
  //       lat: this.lat,
  //       lng: this.lng
  //       },{icon: icon});
  //       this.map.addObjects([startMarker]);
  //     let watch = this.geolocation.watchPosition();
  //       watch.subscribe((data) => {
  //         this.lat = data.coords.latitude
  //         this.lng = data.coords.longitude
  //         this.map.removeObjects([startMarker])
  //         startMarker = new H.map.Marker({
  //           lat: this.lat,
  //           lng: this.lng
  //           });
  //           this.map.addObjects([startMarker]);
  //       });
  //       let actualizarMapa = function(result,map,horarioEntrega) {
  //         var route,
  //         routeShape,
  //         startPoint,
  //         endPoint,
  //         linestring;
  //         if(result.response.route) {
  //           console.log(result)
  //         // Pick the first route from the response:
  //         route = result.response.route[0];
  //         // Pick the route's shape:
  //         routeShape = route.shape;
  //         var fecha = new Date(Date.now())
  //         console.log(fecha)
  //         let segundosParaLaEntrega = route.leg[0].trafficTime
  //         segundosParaLaEntrega = segundosParaLaEntrega+ fecha.getHours() *60*60 + fecha.getMinutes()*60 + fecha.getSeconds()
  //         horarioEntrega.hora = Math.floor(segundosParaLaEntrega/60/60)
  //         horarioEntrega.minutos = Math.floor(segundosParaLaEntrega/60%60)  
  //         horarioEntrega.segundos =Math.floor(segundosParaLaEntrega%60)
  //         // Create a linestring to use as a point source for the route line
  //         linestring = new H.geo.LineString();
        
  //         // Push all the points in the shape into the linestring:
  //         routeShape.forEach(function(point) {
  //         var parts = point.split(',');
  //         linestring.pushLatLngAlt(parts[0], parts[1]);
  //         });
  //         // Retrieve the mapped positions of the requested waypoints:
  //         endPoint = route.waypoint[1].mappedPosition;
         
  //         // Create a polyline to display the route:
  //         var routeLine = new H.map.Polyline(linestring, {
  //           style: {
  //             lineWidth: 10,
  //             fillColor: 'white',
  //             strokeColor: 'rgba(255, 255, 255, 1)',
  //             lineDash: [0, 2],
  //             lineTailCap: 'arrow-tail',
  //             lineHeadCap: 'arrow-head' }
  //             }      
  //             );
  //             var routeOutline = new H.map.Polyline(linestring, {
  //               style: {
  //               lineWidth: 10,
  //               strokeColor: 'rgba(0, 128, 255, 0.7)',
  //               lineTailCap: 'arrow-tail',
  //               lineHeadCap: 'arrow-head'
  //               }
  //             });
              
        
  //         // Create a marker for the end point:
  //         var endMarker = new H.map.Marker({
          
  //         lat: endPoint.latitude,
  //         lng: endPoint.longitude,
          
  //         });
    
  //         // Add the route polyline and the two markers to the map:
  //           map.addObjects([routeLine,routeOutline, endMarker]);
          
          
        
  //         // Set the map's viewport to make the whole route visible:
  //         // map.getViewModel().setLookAtData({bounds: routeLine.getBoundingBox()});
  //         // startMarker.setPosition({ lat: -34.5691263, lng: -58.4776159 });
  //         }
  //       };
  //       var routingParameters = {
  //         // The routing mode:
  //         'mode': 'fastest;car;traffic:enabled',
  //         // The start point of the route:
  //         'waypoint0': 'geo!'+String(this.lat)+','+String(this.lng),
  //         // The end point of the route:
  //         'waypoint1': 'geo!'+'-34.634103,-58.4744191',
  //         // To retrieve the shape of the route we choose the route
  //         // representation mode 'display'
  //         'representation': 'navigation',
  //       };
  //       router.calculateRoute(routingParameters,
  //         x => actualizarMapa(x,this.map,this.horarioEntrega),
  //         function(error) {
  //         alert(error.message);
          
  //         });  
  //   }
  
  

}
