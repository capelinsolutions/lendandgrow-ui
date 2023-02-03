import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Apollo, ApolloBase, gql, Query, QueryRef} from 'apollo-angular';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private apollo: Apollo,private _http: HttpClient) { 
    
  }
  getUserTypes(){
    return this.apollo.watchQuery<Query>({
      query: gql`
        {
          getUserTypes
          {
            message
            status
            data {
             id
             role
            }
        }
        }
        `
    })
    .valueChanges
  }

  uploadImageApi(formData){
    let token = localStorage.getItem("access_token");
    console.log("Token is",token);
    const headers = { 'Authorization': `Bearer ${token}` };
    return this._http.post(environment.uploadImageURL, formData, {headers: headers});
  }

  uploadImageApiforProperty(formData){
    let token = localStorage.getItem("access_token");
    console.log("Token is",token);
    const headers = { 'Authorization': `Bearer ${token}` };
    return this._http.post(environment.uploadPropertyImageURL, formData, {headers:headers});
  }

  getImage(url){
    let token = localStorage.getItem("access_token");
    console.log("Token is",token);
    const headers = { 'Authorization': `Bearer ${token}` };
    return this._http.get(url,{responseType: 'blob',headers: headers});
  }

  removeImage(userType){
    let token = localStorage.getItem("access_token");
    console.log("Token is",token);
    const headers = { 'Authorization': `Bearer ${token}` };
    console.log(userType);
    let url=environment.removeImageURL+userType;
    console.log(url);
    
    return this._http.delete(environment.removeImageURL+userType,{headers: headers});
  }

  getMessageHistory(){
    return this.apollo.query({
      query: gql`
      query{
        getAllChatHistory(pageNo: 0, pageSize: 5){
          status
          code
          message
          data{
            chatHistory{
              senderId
              name
              picture
              lastMessageAt
              recipientId
            }
            pageNo
            pageSize
            noOfPages
            totalRows
          }
        }
      }
      `
    })
  }

  createUser(data,currentUserTypeId) {
    return this.apollo.mutate({
      mutation: gql`
      mutation{
        createUser (input: {
            name: "${data.name}"
            email: "${data.email}"
            password: "${data.password}"
            city: "${data.city}"
            country: "${data.country}"
            contact: "${data.contact}"
            address: "${data.address}"
            userType: "${currentUserTypeId}"
        }
        ) {
            message
            code
            status
            data {
                userId
                name
                email
                contact
                country
                city
                address
                isVerified
                isActive
                userType
            }
        }
    }
      `
    })
  }

  verifyOtp(data){
    return this.apollo.mutate({
      mutation: gql`
      mutation{
        verifyOtp(email: "${data.email}", otpValue: "${data.otp}"){
            status
            code
            message
            data{
                userId
                email
                name
                country
                city
                address
                contact
                isVerified
                isActive
                userType
            }
        }
    }
      `
    })
  }

  getUserByEmail() {
    return this.apollo.query({
      query: gql`
      query{
        loadByUsername{
            message
            code
            status
            data{
                userId
                email
                userType
            }
        }
    }
      `
    })
  }

  resendOtp(userId:any){
    return this.apollo.mutate({
      mutation: gql`
      mutation{
        resendOtp(userId: "${userId}"){
          status
          code
          message
          data
        }
      }
      `
    })
  }

  sendMessageToUser(data: any){
    return this.apollo.mutate({
      mutation: gql`
      mutation{
        sendMessage(
          data:{
            content:"kjdsaljfd"
            recipientId:"lsjadkfjsda"
          }){
          code
          status
          message
          data{
            id
            senderId
            recipientId
            content
          }
        }
      }
      `
    })
  }
  forgetPassword(email: any){
    return this.apollo.mutate({
      mutation: gql`
      mutation{
        createForgetPasswordLink(input:"${email}")
        {
            message
            code
            status
        }
    }
      `
    })
  }

  updatePassword(data: any){
    console.log("Data coming for password update",data);
    
    return this.apollo.mutate({
      mutation: gql`
      mutation{
        updateForgetPassword(input: {
                token:"${data.token}"
                email:"${data.email}"
                password:"${data.password}"
                })
        {
            message
            status
            code
        }
    }
      `
    })
  }

  getRecipientImageUrl(recipientId: any){
    return this.apollo.query({
      query: gql`
      query{
        getProfileImageUrlByUserId(input: "${recipientId}"){
            message
            status
            code
            data
        }
    }
      `
    })
  }

  getChatMessages(){
    return this.apollo.mutate({
      mutation: gql`
      subscription{
        getChatMessages{
            id
            content
            senderId
            recipientId
            sendAt
        }
    }
      `
    })
  }
}