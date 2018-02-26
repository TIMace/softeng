import { Component, OnInit } from '@angular/core';
import { Event } from '../event';

// Services
import { EventService } from '../event.service';
import { UserDetailsService } from '../user-details.service';

// MAP
import { MapsAPILoader } from '@agm/core';
import { } from 'googlemaps';

@Component({
  selector: 'app-events-past',
  templateUrl: './events-past.component.html',
  styleUrls: ['./events-past.component.css']
})
export class EventsPastComponent implements OnInit {

  arrayOfEvents: Array<Event>;

  constructor(
    private eventService: EventService,
    private mapsAPILoader: MapsAPILoader,
    public userDetailsService: UserDetailsService
  ) { }

  bringUserEvent() {
    if (this.userDetailsService.getUserType() === 'Parent') {
      this.eventService.getOldUserEvents().subscribe(
        data => {
          this.arrayOfEvents = data;
        }
      )
    }
    else if (this.userDetailsService.getUserType() === 'Provider') {
      this.eventService.getOldProviderEvents().subscribe(
        data => {
          this.arrayOfEvents = data;
        }
      )
    }
  }

  ngOnInit() {
    this.bringUserEvent();
  }

}
