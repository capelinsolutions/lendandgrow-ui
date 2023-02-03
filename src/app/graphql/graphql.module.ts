import { Injectable, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Apollo, ApolloModule, APOLLO_OPTIONS,APOLLO_NAMED_OPTIONS, NamedOptions } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache, ApolloLink,split, ApolloClient } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
import {WebSocketLink} from '@apollo/client/link/ws';
import {getMainDefinition} from '@apollo/client/utilities';
import { environment } from 'src/environments/environment';
import { GraphqlService } from '../services/graphql/graphql.service';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { HttpClientModule } from '@angular/common/http';
import {onError} from '@apollo/client/link/error';

const uri = environment.apiUrl; 
const urisub = environment.apiSubs;

function operationFilter(operationName:string):boolean{  
  if(operationName!="checkToken") return true;  
  else return false; 
}

@NgModule({
  exports: [
    HttpClientModule,
    ApolloModule
  ],
})

export class GraphqlModule {

  public Clientws: any;
  public subscriptionClient: SubscriptionClient = null;

  constructor(appolo: Apollo ,httpLink: HttpLink){

    const getIdToken = () => localStorage.getItem('access_token') || null;
    const getUserId = () => localStorage.getItem('userId') || null;

    const basic = setContext((operation, context) => ({
      headers: {
        Accept: 'charset=utf-8'
      }
    }));
      
    const auth = setContext((operation, context) => {

      const token = getIdToken();

      if (token === null) {
        return {
          uri: environment.apiUrl
        };
      }
      else {
        return {
          headers: { 'Authorization': `Bearer ${token}` }
        };
      }
    });

    const http = httpLink.create({
      uri(operation){ 
        return operationFilter(operation.operationName)? uri : urisub;
      } 
    });

    const connectionParams = () => {
      const token = getIdToken();
      const userId = getUserId();
      console.log('TOKEN',token);
      console.log('USER ID', userId);
      
      if(token && userId){
        return { 
          'Authorization': `Bearer ${token}`,
          "user_id":`${userId}`,
          "roles": "get:chat_message"  
        }
      } 
      else{
        return {};
      } 
    };
 
    const wsClient = new SubscriptionClient(urisub, {
      reconnect: true,
      connectionParams: connectionParams(),
    });

    this.Clientws = wsClient
    const wsLink = new WebSocketLink(wsClient);
    this.subscriptionClient = (<any>wsLink).subscriptionClient;

    wsClient.onConnected(() => console.log('WebSocket Connected!!'))
    wsClient.onReconnected(() => console.log("Websocket Reconnected!!"))

    const error = onError(({networkError, graphQLErrors}) => {             
      if (graphQLErrors  && getIdToken!=null && getIdToken()!='') {               
        graphQLErrors.map(({
                message,
                locations,
                path,
                extensions
            }) =>{
              if (extensions) {
                if (extensions.exception['status'] == 401 && getIdToken() != null && getIdToken() != '') {                      
                  setTimeout(() => {  
                    localStorage.clear();                 
                    // window.location.href = "/pages/authentication/login-v2";                       
                  }, 7000);
                }
              }
              
            });
    }
    if (networkError) {
        console.log(`[Network error]:`, networkError);
    }
})

const _splitlink = split(
  ({query}) => {
    const data = getMainDefinition(query);    
    return (
      data.kind === 'OperationDefinition' && data.operation === 'subscription'
    );
  },
  wsLink,
  auth.concat(http)
)

const cleanTypeName = new ApolloLink((operation, forward) => {
  if (operation.variables) {
    const omitTypename = (key, value) => (key === '__typename' ? undefined : value);
    operation.variables = JSON.parse(JSON.stringify(operation.variables), omitTypename);
  }
  return forward(operation).map((data) => {
    return data;
  });
});
 
const link = ApolloLink.from([cleanTypeName, basic, error, _splitlink]);
    
const cache = new InMemoryCache({addTypename: false,});
  
    appolo.create({
      link: link,
      cache: cache,
      defaultOptions : {
        watchQuery: {
          fetchPolicy: 'network-only',
          errorPolicy: 'ignore',
        },
        query: {
          fetchPolicy: 'network-only',
          errorPolicy: 'all',
        },
        mutate: {
          fetchPolicy: 'network-only',
          errorPolicy: 'all'
        }
      }
    });
  }
 }


