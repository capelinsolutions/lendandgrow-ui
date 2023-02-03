import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  @Input() data;
  constructor() { }

  // private data={
    
  // }
  ngOnInit(): void {
    console.log("Data",this.data);
    
  }

  uploadDocument(event: any) {

  }
}
