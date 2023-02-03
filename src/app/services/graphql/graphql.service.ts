import { Injectable } from '@angular/core';
import { GraphqlModule } from 'src/app/graphql/graphql.module';

@Injectable({
  providedIn: 'root'
})
export class GraphqlService {

constructor(private graphQLModule: GraphqlModule ) { }

//  connect(){
//   this.graphQLModule.Clientws.connect();
//  }

//  close(){
//   this.graphQLModule.Clientws.close(false,false);
//  }

}
