import { Component, OnInit } from '@angular/core';
import { Event } from '../event';

// Services
import { EventService } from '../event.service';

// MAP
import { MapsAPILoader } from '@agm/core';
import { } from 'googlemaps';

@Component({
  selector: 'app-events-past',
  templateUrl: './events-past.component.html',
  styleUrls: ['./events-past.component.css']
})
export class EventsPastComponent implements OnInit {

  constructor(
    private eventService: EventService,
    private mapsAPILoader: MapsAPILoader
  ) { }

  ngOnInit() {
    this.getEvents();
  }

  past_events: Event[];

  getEvents(): void {
    this.eventService.getEvents("", "", "", "").subscribe(events => this.past_events = events);
  }

}
