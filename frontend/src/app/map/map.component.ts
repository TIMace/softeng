import { Component, OnInit } from '@angular/core';
import { AgmCoreModule } from '@agm/core';

import { MapService } from '../map.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  public latitude: number;
  public longitude: number;
  public zoom: number;

  constructor(
    private mapService: MapService
  ) { }

  ngOnInit() {
    this.latitude = this.mapService.getLatitude();
    this.longitude = this.mapService.getLongitude();
    this.zoom = 12;
  }

  markerDragEnd(event) {
    this.mapService.setLatitude(event.coords.lat);
    this.mapService.setLongitude(event.coords.lng);
    
  }

}
