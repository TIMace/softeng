import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css']
})
export class PanelComponent implements OnInit {

  constructor() { }
  
  show: number;
  show_more: boolean;

  selected_personal_info(){
    this.show = 1;
  }

  selected_present_events(){
    this.show = 2;
  }

  selected_past_events(){
    this.show = 3;
  }

  selected_create_activity(){
    this.show = 4;
  }

  ngOnInit() {
    this.show = 1;
    this.show_more = false;
  }

}
