import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';
import { CreateProperty, createSharedFile } from 'src/app/common/models/createProperty.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BorrowerService {

  constructor(
    private apollo: Apollo,
    private _http: HttpClient
  ) {

  }

  // By Arif
  createProperty(propertyData: CreateProperty, Information: any, imagesArray: any) {
    console.log("PropertyData", propertyData)
    console.log("Information", Information);
    console.log("Images",imagesArray);
    

    return this.apollo.mutate({
      mutation: gql`
       mutation ($borrowerId: String!, $propertyTypeId: String!,$description: String!,$questions: [QuestionRequest!]!,$active: Boolean!,$address: String,$area: String,$price: Float,$title: String,$imageUrls: [String]!) {
         createProperty(input: {
             borrowerId: $borrowerId,
             propertyTypeId: $propertyTypeId,
             description: $description,
             questions: $questions,
             active: $active,
             address: $address,
             area: $area,
             price: $price,
             title: $title,
             imageUrls: $imageUrls
         })
         {
             message
             code
             status
             data {
                 propertyId
                 borrowerId
                 propertyTypeId
                 description
                 questions{
                     id
                     type
                     label
                     inputType
                     name
                     validations {
                         name
                         validator
                         message
                     }
                     propertyTypeId
                     options
                     value
                 }
                 createdAt
                 updatedAt
                 active
             }
         }
     }
       `,
      variables: {
        borrowerId: propertyData.borrowerId,
        propertyTypeId: propertyData.propertyTypeId,
        description: Information.description,
        questions: propertyData.questions,
        active: propertyData.active,
        area: Information.area,
        address: Information.address,
        title: Information.propertyName,
        price: Information.price,
        imageUrls: imagesArray
      }
    })
  }


  // getBorrower(){
  //   return this.apollo.watchQuery({
  //     query: gql`
  //     query getBorrowerListByPagination (\$name: String,\$stateOrCity: String,\$propertyType: String, \$pageNo: Integer){
  //         getBorrowerListByPagination(input: {
  //           name: "saf"
  //           stateOrCity: null
  //           propertyType: null
  //           pageNo: 0
  //         }){
  //           message
  //           data{
  //             borrowerId
  //             firstName
  //             lastName
  //             contactNumber
  //           }
  //         }
  //       }
  //     `
  //   })
  // }

  getBorrower(data: any) {
    return this.apollo.query({
      query: gql`
      query($name: String, $state: String,$city: String, $propertyType : String, $pageNo: Int!,$pageSize: Int!){
        getBorrowerListByPagination(input: {
          name: $name
          state: $state
          city: $city
          propertyTypeId: $propertyType
          pageNo: $pageNo
          pageSize: $pageSize
        }){
            message
            status
            code
            data{
                borrowers{
                    userId
                    email
                    name
                    address
                    city
                    zip
                    state
                    country
                    contact
                    telephone
                    dob
                    gender
                    occupation
                    borrowerId
                    companyName
                    profileImageURL
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
        name: data.name,
        state: data.state,
        city: data.city,
        propertyType : data.propertyType,
        pageNo: data.pageNo,
        pageSize: data.pageSize
      }
    })
  }


  getSingleBorrower() {
    return this.apollo.query({
      query: gql`
      query{
        getBorrower
        {
            message
            code
            status
            data{
                userId
                email
                name
                address
                city
                zip
                state
                country
                contact
                telephone
                dob
                gender
                occupation
                borrowerId
                companyName
                profileImageURL
            }
        }
    }`
    })
  }

  saveBorrowerImage(body: any): Observable<any> {
    return this._http.post(environment.uploadImageURL, body, { headers: environment.headers });
  }

  updateBorrowerProfile(body: any) {
    console.log(body,"Data coming for update is");
    
    return this.apollo.mutate({
      mutation: gql`
      mutation{
        updateBorrower(
            input:{
                borrowerId: "${body.borrowerId}"
                userId: "${body.userId}"
                name: "${body.name}"
                address: "${body.address}"
                city: "${body.city}"
                zip: "${body.zip}"
                state: "${body.state}"
                country: "${body.country}"
                contact: "${body.contact}"
                telephone: "${body.telephone}"
                dob: "${body.dob}"
                gender: "${body.gender}"
                companyName: "${body.companyName}"
                occupation: "${body.occupation}"
            }){
            message
            data{
                userId
                email
                name
                address
                city
                zip
                state
                country
                contact
                telephone
                dob
                gender
                occupation
                borrowerId
                companyName
                profileImageURL
            }
        }
    }`
    })
  }

  getAllFormByPropertyTypeId(propertyTypeId: any) {
    return this.apollo.query({
      query: gql`
      query{
        getAllFormByPropertyTypeId(input: "${propertyTypeId}"){
            message
            code
            status
            data {
                id
                label
                type
                inputType
                name
                validations {
                    name
                    validator
                    message
                }
                propertyTypeId
                options
                value
            }
        }
    }
      `
    }).toPromise();
  }

  getAllPropertyTypes() {
    return this.apollo.query({
      query: gql`
      query {
        getAllPropertyTypes
        {
            message
            status
            code
            data{
                propertyTypeId
                title
                description
                iconUrl
            }
        }
    }
      `
    })
  }

  getAllPropertyTypesForLoggedInUser() {
    return this.apollo.query({
      query: gql`
      query {
        getAllPropertyForLoggedInUser{
            message
            code
            status
            data {
                propertyId
                borrowerId
                propertyTypeId
                title
                description
                price
                address
                area
                imageUrls
                questions{
                    id
                    type
                    label
                    inputType
                    name
                    validations {
                        name
                        validator
                        message
                    }
                    propertyTypeId
                    options
                    value
                }
                createdAt
                updatedAt
                active
            }
        }
    }
      `
    })
  }


  getAdditionalBorrowerData(Id) {
    return this.apollo.query({
      query: gql`
      query getUser{
        getUser(userId: "${Id}"){
            userId
            email
            cognitoId
            userType
        }
      }
      `
    })
  }

  getPropertyById(propertyId) {
    return this.apollo.query({
      query: gql`
      query {
        getPropertyById(input: "${propertyId}"){
            message
            code
            status
            data {
                propertyId
                borrowerId
                propertyTypeId
                description
                price
                title
                area
                imageUrls
                questions{
                    id
                    type
                    label
                    inputType
                    name
                    validations {
                        name
                        validator
                        message
                    }
                    propertyTypeId
                    options
                    value
                }
                createdAt
                updatedAt
                active
            }
        }
    }
      `
    })
  }
  getAllPropertByBorrowerId(Id: any){
    return this.apollo.query({
      query: gql`
      query {
        getAllPropertyByBorrowerId(input: "${Id}") {
            message
            code
            status
            data {
                propertyId
                borrowerId
                propertyTypeId
                description
                imageUrls
                title
                price
                questions{
                    id
                    type
                    label
                    inputType
                    name
                    validations {
                        name
                        validator
                        message
                    }
                    propertyTypeId
                    options
                    value
                }
                createdAt
                updatedAt
                active
            }
        }
    }
      `
    })
  }
  getPropertiesByPagination(data: any,borrowerId){
    console.log("data to api",data);
    
    return this.apollo.query({
      query: gql`
      query($title: String, $area: String,$priceStart: Float,$priceEnd: Float,$pageNo: Int!,$pageSize: Int!,$borrowerId:String){
        getPropertyListByPagination(input: {
            borrowerId: $borrowerId
            title: $title
            area: $area
            priceStart: $priceStart
            priceEnd: $priceEnd
            pageNo: $pageNo
            pageSize: $pageSize
        }){
            message
            status
            code
            data{
                property{
                    propertyId
                    borrowerId
                    propertyTypeId
                    title
                    description
                    price
                    address
                    area
                    imageUrls
                    questions{
                        id
                        type
                        label
                        inputType
                        name
                        validations {
                            name
                            validator
                            message
                        }
                        propertyTypeId
                        options
                        value
                    }
                    createdAt
                    updatedAt
                    active
                }
                pageNo
                pageSize
                noOfPages
                totalRows
            }
        }
    }
      `
      ,
      variables: {
        title: data.title,
        area: data.area,
        priceStart: data.priceStart,
        priceEnd: data.priceEnd,
        pageNo: data.pageNo,
        pageSize: data.pageSize,
        borrowerId: borrowerId
      }
    })
  }

  getPropertyList(data: any) {
    return this.apollo.query({
      query: gql`
      query($priceStart: Float, $priceEnd: Float, $city: String, $address: String, $propertyType: String, $pageNo: Int!, $pageSize: Int!){
        getPropertyListByPaginationWithFilter(input: {
          city: $city
          address: $address
          propertyTypeTitle: $propertyType
          priceStart: $priceStart
          priceEnd: $priceEnd
          pageNo: $pageNo
          pageSize: $pageSize
      }){
          message
          status
          code
          data{
              property{
                  propertyId
                  borrowerId
                  propertyTypeId
                  title
                  description
                  price
                  address
                  area
                  imageUrls
                  questions{
                      id
                      type
                      label
                      inputType
                      name
                      validations {
                          name
                          validator
                          message
                      }
                      propertyTypeId
                      options
                      value
                  }
                  createdAt
                  updatedAt
                  active
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
        priceStart: data.priceStart,
        priceEnd: data.priceEnd,
        address: data.address,
        city: data.city,
        propertyTypeTitle: data.propertyType,
        pageNo: data.pageNo,
        pageSize: data.pageSize
      }
    })
  }


  createSharedFile(data: createSharedFile){
    console.log("Data coming to borrower service",data);
    
    return this.apollo.mutate({
      mutation: gql`
      mutation($propertyId: String!,$emailsDocumentAccess: [EmailsDocumentAccessInput!]!){
        createSharedFile(input: {
            propertyId: $propertyId
            emailsDocumentAccess: $emailsDocumentAccess
        }) {
            message
            code
            status
            data{
                sharedFileId
                property{
                    propertyId
                    description
                }
                emailsDocumentAccess{
                    email
                    documentAccess{
                        documentUrl
                        accessType
                    }
                }
            }
        }
    }
      `,
      variables: {
        propertyId: data.propertyId,
        emailsDocumentAccess: data.emailsDocumentAccess
      }
    })
  }

  getSharedFileDataByPropertyId(propertyId:any){
    return this.apollo.query({
      query:gql`
      query {
        getSharedFileByPropertyId(input: "${propertyId}"){
            message
            code
            status
            data {
                sharedFileId
                property{
                    propertyId
                    description
                }
                emailsDocumentAccess{
                    email
                    documentAccess{
                        documentUrl
                        accessType
                    }
                }
            }
        }
    }
      `
    })
  }

  updateSharedFileData(data:any){
    console.log(data,"data Coming toservice");
    
    return this.apollo.mutate({
      mutation: gql`
      mutation($sharedFileId:String!,$propertyId: String!,$emailsDocumentAccess: [EmailsDocumentAccessInput!]!){
        updateSharedFile(input: {
            sharedFileId: $sharedFileId
            propertyId: $propertyId
            emailsDocumentAccess: $emailsDocumentAccess
        }) {
            message
            code
            status
            data{
                sharedFileId
                property{
                    propertyId
                    description
                }
                emailsDocumentAccess{
                    email
                    documentAccess{
                        documentUrl
                        accessType
                    }
                }
            }
        }
    }
      `,
      variables:{
        sharedFileId: data.sharedFileId,
        propertyId: data.propertyId,
        emailsDocumentAccess: data.emailsDocumentAccess
      }
    })
  }

  getBorrowerDocumentsForInvestor(propertyId: any){
    return this.apollo.query({
      query: gql`
      query {
        getSharedFileByInvestorEmailAndPropertyId(input:
            "${propertyId}"
        ){
            message
            code
            status
            data {
                sharedFileId
                property{
                    propertyId
                    description
                    description
                    price
                    title
                    area
                    imageUrls
                }
                emailsDocumentAccess{
                    email
                    documentAccess{
                        documentUrl
                        accessType
                    }
                }
            }
        }
    }
      `
    })
  }

  getContactedInvestor(){
    return this.apollo.query({
      query: gql`
      query{
        getTotalNoOfContactedInvestor{
          status
          code
          message
          data
        }
      }
      `
    })
  }
  
  totalBorrowerProperties(){
    return this.apollo.query({
      query: gql`
      query{
        getTotalNoOfPropertiesOfBorrower
        {
            message
            status
            code
            data
        }
    }
      `
    })
  }

  
  

  getBorrowerById(Id: any) {
    return this.apollo.query({
      query: gql`
      query{
        getBorrowerById(id: "${Id}")
        {
            message
            code
            status
            data{
                userId
                email
                name
                address
                city
                zip
                state
                country
                contact
                telephone
                dob
                gender
                occupation
                borrowerId
                companyName
                profileImageURL
            }
        }
    }`
    })
  }


}
