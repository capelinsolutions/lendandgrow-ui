import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';

@Injectable({
  providedIn: 'root'
})
export class LenderService {

  constructor(private apollo: Apollo) { }

  createLender(data) {
    return this.apollo.mutate({
      mutation: gql`
        mutation CreateLendor {
          createLendor(input: {
            user: "${data.userId}"
            firstName: "${data.firstName}"
            lastName: ""
            address: "${data.address}"
            addressDetails: ""
            city: "${data.city}"
            zip: ""
            state: ""
            country: "${data.country}"
            contactNumber: "${data.contactNumber}"
            telephone: ""
            dob: ""
            gender: ""
            occupation: ""
          }){
            message
            data{
              firstName
              lastName
              address
              addressDetails
              city
              zip
              state
              country
              contactNumber
              telephone
              dob
              gender
              occupation
            }
          }
        }
      `
    })
  }

  createInvestor(data) {
    console.log("Data is", data);

    return this.apollo.mutate({
      mutation: gql`
        mutation {
          createInvestor(input: {
            userId: "${data.userId}"
            firstName: "${data.firstName}"
            lastName: ""
            address: "${data.address}"
            addressDetails: ""
            city: "${data.city}"
            zip: ""
            state: ""
            country: "${data.country}"
            contactNumber: "${data.contactNumber}"
            productOffer : "${data.productOffer}"
            feeStructureId : "${data.feeStructure}"
            requiredDocs :  "${data.requiredDocs}"
            telephone: ""
            dob: ""
            gender: ""
            occupation: ""
          }){
            message
            data{
              firstName
              lastName
              address
              addressDetails
              city
              zip
              state
              country
              contactNumber          
              telephone
              gender
              occupation
            }
          }
        }
      `
    })
  }

  getInvestor(data) {
    console.log(data.pageNo, "pageno");
    console.log(data.pageSize, "pagesize");
    return this.apollo.query({
      query: gql`
      query($name: String, $state: String,$city: String,$pageNo: Int!,$pageSize: Int!,$feeStructureId: String){
        getInvestorListByPagination(input: {
            name: $name
            state: $state
            city: $city
            feeStructureId: $feeStructureId
            pageNo: $pageNo
            pageSize: $pageSize
        }){
            message
            status
            code
            data{
                investors{
                    investorId
                    userId
                    email
                    name
                    dob
                    address
                    city
                    zip
                    state
                    country
                    contact
                    telephone
                    gender
                    occupation
                    about
                    companyName
                    serialNo
                    additionalLanguage
                    feeStructureId
                    profileImageURL
                    questions
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
        pageNo: data.pageNo,
        pageSize: data.pageSize,
        feeStructureId: data.feeStructureId
      }
    })
  }

  // getSingleInvestor(Id) {
  //   return this.apollo.query({
  //     query: gql`
  //     query getInvestor{
  //         getInvestor(InvestorID: "${Id}")
  //         {
  //           message
  //           code
  //           status
  //           data{
  //             investorId
  //           firstName
  //           lastName
  //           contactNumber
  //           user
  //           }
  //         }
  //       }
  //     `
  //   })
  // }

  getSingleInvestor() {
    return this.apollo.query({
      query: gql`
      query getInvestor{
        getInvestor
          {
            message
            code
            status
            data{
              investorId
              userId
              name
              address
              email
              city
              zip
              state
              country
              gender
              contact
              telephone
              dob
              occupation
              companyName
              additionalLanguage
              serialNo
              about
              feeStructureId
              profileImageURL
              questions
          }
          }
        }
      `
    })
  }
  getAdditionalInvestorData(Id) {
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

  getfeeStructure() {
    return this.apollo.query({
      query: gql`
      query getAllFeeStructure{
        getAllFeeStructure {
            message
            status
            code
            data{
                id
                from
                to
                text
            }
        }
    }`
    })
  }

  getFeeStructureById(id) {
    return this.apollo.query({
      query: gql`
    query{
      getFeeStructure(input:"${id}"){
        message
        code
        status
        data{
          id
          to
          from
          text
        }
      }
    }
    `
    })
  }

  // getAllFormByListOfId(questionIds) {
  //   console.log(questionIds,"ids");

  //   return this.apollo.query({
  //     query: gql`
  //     query($questions: [String]){
  //       getAllFormByListOfId(input: $questions){
  //           message
  //           code
  //           status
  //           data {
  //               propertyType{
  //                    propertyTypeId
  //                   title
  //                   description
  //                   iconUrl
  //               }
  //               forms{
  //                   id
  //                   label
  //                   type
  //                   inputType
  //                   name
  //                   validations {
  //                       name
  //                       validator
  //                       message
  //                   }
  //                   propertyTypeId
  //                   options
  //                   value
  //               }
  //           }
  //       }
  //   }
  //   `,
  //   variables:{
  //     questions: questionIds
  //   }
  //   })
  // }


  getAllFormByListOfId() {

    return this.apollo.query({
      query: gql`
      query{
        getAllFormByListOfId{
            message
            code
            status
            data {
                propertyType{
                     propertyTypeId
                    title
                    description
                    iconUrl
                }
                forms{
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
                    isSelected
                }
            }
        }
    }
    `
    })
  }

  getPropertyAndQuestionsbyIds() {
    return this.apollo.query({
      query: gql`
    query {
      getAllPropertyByListOfId{
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
    `
    })
  }


  getInvestorById(id: any) {
    return this.apollo.query({
      query: gql`
    query{
      getInvestorById(id: "${id}")
      {
          message
          code
          status
          data{
              investorId
              userId
              email
              name
              dob
              address
              city
              zip
              state
              country
              contact
              telephone
              gender
              occupation
              about
              companyName
              serialNo
              additionalLanguage
              feeStructureId
              profileImageURL
              questions
          }
      }
  }
    `
    })
  }

  getAllInvestors() {
    return this.apollo.query({
      query: gql`
      query{
        getAllInvestor{
            message
            code
            status
            data{
                name
                address
                email
                city
                zip
                country
                state
            }
        }
    }
      `
    })
  }

  getAllFormsBySelectedInvestorQuestionsIds(Ids: any) {
    return this.apollo.query({
      query: gql`
    query($questions: [String]){
      getFormsByListOfForms(input:$questions)
      {
          message
          code
          status
          data {
              propertyType{
                  propertyTypeId
                  title
                  description
                  iconUrl
              }
              forms{
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
  }
      `,
      variables: {
        questions: Ids
      }
    })
  }

  updateInvestor(data) {
    console.log(data, "Data is");

    return this.apollo.mutate({
      mutation: gql`
    mutation ($investorId: String!, $userId: String!,$name: String!,$questions: [String],$address: String!, $email: String!, $telephone: String!,
      $city: String!, $zip: String!,$state: String!,$country: String!, $contact: String!,$dob: String!, $gender: String!,$occupation: String!,
      $companyName: String!, $additionalLanguage: String!,$feeStructureId: String!,$about: String!){
      updateInvestor(input:
          {
              investorId: $investorId
              userId: $userId
              name: $name
              address: $address
              email: $email
              city: $city
              zip: $zip
              state: $state
              country: $country
              contact: $contact
              telephone: $telephone
              dob: $dob
              gender: $gender
              occupation: $occupation
              companyName: $companyName
              additionalLanguage: $additionalLanguage
              feeStructureId: $feeStructureId
              questions: $questions
              about: $about
      })
          {
              message
              code
              status
              data{
                  investorId
                  userId
                  name
                  email
                  dob
                  address
                  city
                  zip
                  state
                  country
                  contact
                  telephone
                  gender
                  occupation
                  about
                  companyName
                  serialNo
                  additionalLanguage
                  feeStructureId
                  profileImageURL
                  questions
              }
          }
  }
    ` ,
      variables: {
        investorId: data.investorId,
        userId: data.userId,
        name: data.name,
        address: data.address,
        email: data.email,
        city: data.city,
        zip: data.zip,
        state: data.state,
        country: data.country,
        contact: data.contact,
        telephone: data.telephone,
        dob: data.dob,
        gender: data.gender,
        occupation: data.designation,
        companyName: data.companyName,
        additionalLanguage: data.additionalLanguage,
        feeStructureId: data.feeStructure,
        questions: data.propertyQuestions,
        about: data.about,
      }
    })
  }


  getContactedBorrower(){
    return this.apollo.query({
      query:gql`
      query{
        getTotalNoOfContactedBorrower{
            message
            status
            code
            data
        }
    }
      `
    })
  }
  // updateInvestor(data){
  //   console.log(data.propertyQuestions);

  //   return this.apollo.mutate({
  //     mutation: gql`
  //     mutation{
  //       updateInvestor(input:
  //           {
  //               investorId: "${data.investorId}"
  //               userId: "${data.userId}"
  //               name: "${data.name}"
  //               address: "${data.address}"
  //               email: "${data.email}"
  //               city: "${data.city}"
  //               zip: "${data.zip}"
  //               state: "${data.state}"
  //               country: "${data.country}"
  //               contact: "${data.contact}"
  //               telephone: "${data.telephone}"
  //               dob: "2022-12-12"
  //               gender: "${data.gender}"
  //               occupation: "${data.designation}"
  //               companyName: "${data.companyName}"
  //               additionalLanguage: "${data.additionalLanguage}"
  //               feeStructureId: "${data.feeStructure}"
  //               questions: "${data.propertyQuestions}"
  //               about: "${data.about}"
  //       })
  //           {
  //               message
  //               code
  //               status
  //               data{
  //                   investorId
  //                   userId
  //                   name
  //                   email
  //                   dob
  //                   address
  //                   city
  //                   zip
  //                   state
  //                   country
  //                   contact
  //                   telephone
  //                   gender
  //                   occupation
  //                   about
  //                   companyName
  //                   serialNo
  //                   additionalLanguage
  //                   feeStructureId
  //                   profileImageURL
  //                   questions
  //               }
  //           }
  //   }
  //     `
  //   })
  // }

}

