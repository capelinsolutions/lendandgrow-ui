import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

constructor(private apollo: Apollo) { }

  readAllMessages(senderId: any){
    return this.apollo.mutate({
      mutation: gql`
      mutation{
        markAllUnreadMessageToRead(senderId:"${senderId}"){
          message
          code
          status
          data
        }
      }
      `
    })
  }

 sendMessage(data){
   return this.apollo.mutate({
       mutation: gql`
       mutation {
        sendMessage(
            data: { content: "${data.message}", recipientId: "${data.userId}" }
        ) {
            message
            status
            code
            data {
                id
                content
                senderId
                recipientId
                sendAt
            }
        }
    } `
  })
 }

 getAllChatMessage(data: any) {
  return this.apollo.query({
    query: gql`
    query($senderId : String, $recipientId: String, $pageNo: Int!, $pageSize: Int! ){
      getMessagesByRecipientIdAndUserIdByPagination(input: {
              senderId: $senderId
              recipientId: $recipientId
              pageNo: $pageNo
              pageSize: $pageSize
      }){
          message
          status
          code
          data {
              chatMessages{
                  id
                  content
                  senderId
                  recipientId
                  sendAt
                  isRead
              }
              pageNo
              pageSize
              noOfPages
              totalRows
          }
      }
  }
    `,
    variables: {
      senderId: data.senderId,
      recipientId: data.recipientId,
      pageNo: data.pageNo,
      pageSize: data.pageSize
    }
  })
}


}
