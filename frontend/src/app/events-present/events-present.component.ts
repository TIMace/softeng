import { Component, OnInit } from '@angular/core';
import { Event } from '../event';

//pdfMake
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

// Services
import { EventService } from '../event.service';
import { UserDetailsService } from '../user-details.service';

// MAP
import { MapsAPILoader } from '@agm/core';
import { } from 'googlemaps';

@Component({
  selector: 'app-events-present',
  templateUrl: './events-present.component.html',
  styleUrls: ['./events-present.component.css']
})
export class EventsPresentComponent implements OnInit {

  arrayOfEvents : Array<Event>;

  constructor(
    private eventService: EventService,
    private mapsAPILoader: MapsAPILoader,
    public userDetailsService: UserDetailsService
  ) { }

  bringUserEvent() {
    if (this.userDetailsService.getUserType() === 'Parent') {
      this.eventService.getUserEvents().subscribe(
        data => {
          this.arrayOfEvents = data;
        }
      )
    }
    else if (this.userDetailsService.getUserType() === 'Provider') {
      this.eventService.getProviderEvents().subscribe(
        data => {
          this.arrayOfEvents = data;
        }
      )
    }
  }

  ngOnInit() {
    this.bringUserEvent();
  }

  onClickPdf() {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    var dd = { content: 'ORESTI MODELO  ... ' };
   pdfMake.createPdf(dd).download();
  }

}