import { Component, OnInit } from '@angular/core';
import { Event } from '../event';

// Services
import { EventService } from '../event.service';

// MAP
import { MapsAPILoader } from '@agm/core';
import { } from 'googlemaps';
import { UserDetailsService } from '../user-details.service';

@Component({
  selector: 'app-events-present',
  templateUrl: './events-present.component.html',
  styleUrls: ['./events-present.component.css']
})
export class EventsPresentComponent implements OnInit {

  constructor(
    private eventService: EventService,
    public userDetailsService: UserDetailsService,
    private mapsAPILoader: MapsAPILoader
  ) { }

  ngOnInit() {
    this.getEvents();
  }

  current_events: Event[];

  getEvents(): void {
    this.eventService.getEvents("", "", "", "").subscribe(events => this.current_events = events);
  }

}
