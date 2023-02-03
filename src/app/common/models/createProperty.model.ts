import { FieldConfig } from "../interface/field.interface"


export class ValidationInputForProperty {

      name: string;
        validator: any;
        message: string;
}

export class QuestionRequest{

     label?: string
     name?: string
     inputType?: string
     options?: any[]
     collections?: any
     type?: string
     value?: any
     validations?: ValidationInputForProperty[]
   //  _typename: String

}

export class propertyInformation{

  area: String
  propertyName: String
  price: String
  address: String
  description: String
//  _typename: String

}

export class PropertyQuestionsList{
  forms: any[]  
  propertyType: any
}

export class CreateProperty{
    borrowerId: String
    propertyTypeId: String
    description: String
    active: Boolean = true
    questions : QuestionRequest[] = []
   // questions : Questions[]
    // questions : [{
    //    label?: string
    //    name?: string
    //    inputType?: string
    //    options?: any[]
    //    collections?: any
    //    type?: string
    //    value?: any
    //    validations?: [{
    //       name: string;
    //       validator: any;
    //       message: string;
    //    }]
    // }]
}

export class DocumentAccessInput{
  documentUrl: String
  accessType: [String]
}
export class EmailsDocumentAccessInput{
  documentAccess: DocumentAccessInput[]=[]
  email:string
}

export class createSharedFile{
  propertyId: String
  emailsDocumentAccess: EmailsDocumentAccessInput[]=[]
}