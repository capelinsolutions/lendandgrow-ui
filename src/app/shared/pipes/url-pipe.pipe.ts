import { Pipe, PipeTransform } from '@angular/core';
@Pipe({name: 'urlSetting'})
export class urlSetting implements PipeTransform {
  transform(value: string) {
    let pdfName;
    
    if(value != null){
      pdfName = value.split('=')[1].split('&')[0];      
      if(pdfName.length > 30){
        return pdfName.substring(pdfName.length-25,pdfName.length);
      }
      else{
        return pdfName.substring(13,pdfName.length);
      }
    }
    
    
  }
}