import { Component, OnInit } from '@angular/core';
import { Event } from '../event';

// Services
import { EventService } from '../event.service';

@Component({
  selector: 'app-events-present',
  templateUrl: './events-present.component.html',
  styleUrls: ['./events-present.component.css']
})
export class EventsPresentComponent implements OnInit {

  constructor(
    private eventService: EventService
  ) { }

  ngOnInit() {
    this.getEvents();
  }

  current_events: Event[];

  getEvents(): void {
    this.eventService.getEvents("", "", "", "").subscribe(events => this.current_events = events);
  }

}
