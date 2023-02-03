import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Subject,BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private apollo: Apollo) { }

  public notificationCount = new Subject<any>();
  $notificationCount = this.notificationCount.asObservable();

  getAllNotifications() {
    return this.apollo.query({
      query: gql`
      query GET_ALL_NOTIFICATION{
        getAllNotifications {
            message
            code
            status
            data {
              notifications{
                  senderName
                  senderId
                  content
                  count
                  sendAt
                }
              totalCount
            }
        }
    }`
    })
  }


  markAllNotificationAsRead(data) {
    console.log("Data is", data);
    return this.apollo.mutate({
      mutation: gql`
      mutation MARK_ALL_NOTIFICATION_TO_READ {
        markAllUnreadMessageToRead(senderId: "SENDER_ID"){
            data
            status
            code
            message
        }
    }`
    })
  }

}






