import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';

@Component({
  selector: 'app-property-card',
  templateUrl: './property-card.component.html',
  styleUrls: ['./property-card.component.scss']
})
export class PropertyCardComponent implements OnInit {

  @Input() hideDetails;
  @Input() cardData;
  @Input() deal;
  imageUrl = ""
  id: any
  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    console.log(this.route);
    this.route.url.subscribe(res=>{
      console.log(res);
      
    })
    this.route.params.subscribe(res => {
      console.log("Route Response",res)
    });
    console.log(this.deal,"deal");
    this.imageUrl = this.deal.imageUrls[0];
    console.log(this.imageUrl,"Image");
    if (Object.keys(this.deal).length > 0) {
      this.id = this.deal.propertyId
    }
  }

}
