import { Component, OnInit, Input, NgZone, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Event } from '../event';
import { EVENTS } from '../mock-events';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormControl } from '@angular/forms';
import { CategoriesService } from '../categories.service';
import { Router } from '@angular/router';

// MAP
import { AgmMap } from '@agm/core/directives/map';
import { MapsAPILoader } from '@agm/core';
import { } from 'googlemaps';
import { MapComponent } from '../map/map.component';
import { MatDialog, MatDialogRef } from '@angular/material';
import { MapService } from '../map.service';
// Services
import { EventService } from '../event.service';
import { element } from 'protractor';


import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import {server_addr} from '../server_addr';
import {HttpClient} from '@angular/common/http';
import {HttpErrorResponse} from '@angular/common/http';
import { HttpParams, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Http, Response, Headers, RequestOptions } from '@angular/http'; 




@Component({
  selector: 'app-create-activity',
  templateUrl: './create-activity.component.html',
  styleUrls: ['./create-activity.component.css']
})
export class CreateActivityComponent implements OnInit {

  @Input() category: Event;

  constructor(
    private eventService: EventService,
    private route: ActivatedRoute,
   // private location: Location,
    private categoriesService: CategoriesService,
    private mapService: MapService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private dialog: MatDialog,
    private router: Router,
    private httpClient:HttpClient


  ) { }

   //-------------- MAP --------------//

   mapDialogRef: MatDialogRef<MapComponent>;

   @ViewChild("search")
   public searchElementRef: ElementRef;
 
   @ViewChild(AgmMap) private map: any;
 
   public latitude: number;
   public longitude: number;
   public zoom: number;
   public searchControl: FormControl;
 
   openMap() {
     this.mapService.setLatitude(this.latitude);
     this.mapService.setLongitude(this.longitude);
     this.mapDialogRef = this.dialog.open(MapComponent, {
       height: "80%",
       width: "80%",
     });
 
     this.mapDialogRef.afterClosed().subscribe(result => {
       console.log(`Map closed!`); // Pizza!
       this.latitude = this.mapService.getLatitude();
       this.longitude = this.mapService.getLongitude();
       var geocoder = new google.maps.Geocoder;
       this.geocodeLatLng(geocoder);
     });
   }
 
   location: string;
   geocodeLatLng(geocoder) {
     var latlng = {lat: this.mapService.getLatitude(), lng: this.mapService.getLongitude()};
     geocoder.geocode({'location': latlng}, function(results, status) {
       if (status === 'OK') {
         if (results[0]) {
           // console.log(results[0].formatted_address);
           //  this.location = results[0].formatted_address;
           // console.log(this.location);
           (<HTMLInputElement>document.getElementById("location")).value = results[0].formatted_address;
         } else {
           window.alert('No results found');
         }
       } else {
         window.alert('Geocoder failed due to: ' + status);
       }
     });
   }
 
   write() {
     //create search FormControl
     this.searchControl = new FormControl();
  
     //set current position
     this.setCurrentPosition();
 
     //load Places Autocomplete
     this.mapsAPILoader.load().then(() => {
       let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
         types: ["address"]
       });
       autocomplete.addListener("place_changed", () => {
         this.ngZone.run(() => {
           //get the place result
           let place: google.maps.places.PlaceResult = autocomplete.getPlace();
 
           //verify result
           if (place.geometry === undefined || place.geometry === null) {
             return;
           }
 
           this.location = place.formatted_address;
           //set latitude, longitude and zoom
           this.latitude = place.geometry.location.lat();
           this.longitude = place.geometry.location.lng();
 
           this.mapService.setLatitude(this.latitude);
           this.mapService.setLongitude(this.longitude);
 
           this.zoom = 12;
         });
       });
     });
   }
 
   private setCurrentPosition() {
     if ("geolocation" in navigator) {
       navigator.geolocation.getCurrentPosition((position) => {
         this.latitude = position.coords.latitude;
         this.longitude = position.coords.longitude;
         this.zoom = 12;
       });
     }
   }

   createEvent(){

   }

   cancelEvent(){
    this.router.navigate(['/panel']);
   }

   checkedCategories:string[] = [];
   checkedCategoriesInit () {
     this.categories.forEach(element => {
       this.checkedCategories.push("false")
     })
   }
   title:string;
   date:Date;
   ageMin:string;
   ageMax:string;
   description:string;
   euros:string;
   cents:string;
   temp(){
    this.location = (<HTMLInputElement>document.getElementById("location")).value;
    console.log(this.location);
    console.log(this.euros);
    console.log(this.cents);
  }

  categories;
  ngOnInit() {
    this.categoriesService.getCategories()
    .subscribe(
      (data:any) => {
        this.categories = data
        this.checkedCategoriesInit();
        console.log(this.categories);
      }
    );
    this.category = EVENTS[0];
    this.write();
    // this.getEvent();
  };

 //l = Object.keys(this.categories).length;
  // getEvent(): void {
  //   const id = +this.route.snapshot.paramMap.get('id');
  //   this.eventService.getEvent(id)
  //     .subscribe(event => this.event = event);
  // }

  changeCheckbox(catIndex,catName) {
    if(this.checkedCategories[catIndex] === "false") {
      this.checkedCategories[catIndex] = catName
    }
    else {
      this.checkedCategories[catIndex] = "false"
    }
  }


  fileToUpload: File = null;

  uploadFileToActivity() {

    this.postFile(this.fileToUpload).subscribe( data => {
      console.log("Success");
    }, error => {
      console.log(error);
    });
  }

  postFile(fileToUpload: File): Observable<boolean> {
    const endpoint = 'http://localhost:8989/upload';
    const formData: FormData = new FormData();
    formData.append('fileKey', fileToUpload, fileToUpload.name);
    return this.httpClient
      .post(endpoint, formData, { headers: new HttpHeaders()
        // .set('Content-Type', 'application/json')
       })
      .map(() => { return true; })
      // .catch((e) => this.handleError(e));
  }

  url: String;
  readUrl(event:any) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
  
      reader.onload = (event:any) => {
        this.url = event.target.result;
      }
  
      this.fileToUpload = event.target.files.item(0);
      reader.readAsDataURL(event.target.files[0]);
    }
  }

}

export class eventDetailsObj {
  title:string = "";
  //image
  address:string = "";
  categories:string = "";
  ageMin:string = "";
  ageMax:string = "";
  descrition:string = "";
  euros:string = "";
  cents:string = "";
}
