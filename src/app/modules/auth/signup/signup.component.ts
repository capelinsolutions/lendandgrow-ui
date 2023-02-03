import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import { Auth } from 'aws-amplify';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/services/user/user.service';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  isLoading: Boolean = false;
  showForm: Boolean = false;
  signupForm: FormGroup;
  confirmPasswordError: boolean = false;
  userType: String = '';
  userTypeData: any;
  currentUserTypeId: String;
  error_messages = {
    'name': [
      { type: 'required', message: 'Name is required.' },
      { type: 'minlength', message: 'Name must be greater than 2 digits.' },
      { type: 'maxlength', message: 'Name must be less than 18 digits' }
    ],
    'email': [
      { type: 'required', message: 'Email is required.' },
      { type: 'email', message: 'Please provide valid email.' }
    ],
    'password': [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be greater than 7 digits.' },
      { type: 'maxlength', message: 'Password must be less than 17 digits' }
    ],
    'confirmPassword': [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be greater than 7 digits.' },
      { type: 'maxlength', message: 'Password must be less than 17 digits' }
    ],
    'address': [
      { type: 'required', message: 'Address is required.' },
      { type: 'minlength', message: 'Address must be greater than 4 digits.' },
      { type: 'maxlength', message: 'Address must be less than 16 digits' }
    ],
    'country': [
      { type: 'required', message: 'Country is required.' },
      { type: 'minlength', message: 'Country must be greater than 3 digits.' },
      { type: 'maxlength', message: 'Country must be less than 20 digits' }
    ],
    'city': [
      { type: 'required', message: 'City is required.' },
      { type: 'minlength', message: 'City must be greater than 3 digits.' },
      { type: 'maxlength', message: 'City must be less than 20 digits' }
    ],
    'contactNumber': [
      { type: 'required', message: 'Contact Number is required.' },
    ],
    
  }

  constructor(private formBuilder: FormBuilder, private router: Router, private apollo: Apollo, private _userService: UserService) { 
  }
  
  ngOnInit(): void {
    this._userService.getUserTypes().subscribe((result: any) => {
      //  console.log("RESO:E", result)
       this.userTypeData = result.data.getUserTypes.data
      }, (error: any)=> {
        // console.log("ERROR IN GET USER TYPE", error)
      });
    // this.createUserInDB()
    // this.apollo.watchQuery({
    //   query: gql`
    //   {
    //     getUserTypes
    //     {
    //       message
    //       status
    //       data {
    //        id
    //        role
    //       }
    //   }
    //   }
    //   `,
    // }).valueChanges.subscribe((result: any) => {
    //  console.log("RESO:E", result)
    //  this.userTypeData = result.data.getUserTypes.data
    // }, (error: any)=> {
    //   alert(error)
    // });
  }

  handleShowForm(type:String) {
    this.showForm = true
    this.userType=type
    let ob = this.userTypeData.find((dt) => dt?.role === type)
    this.currentUserTypeId = ob.id
  }

  createUserInDB() {
    this.apollo.mutate({
      mutation: gql`
      mutation CreateUser {
        createUser(input:{
          email: "${this.signupForm.value.email}"
          userType: "${this.currentUserTypeId}"
          cognitoId: "12345"
        }){
            message
            data{
                userId
                email
                cognitoId
                isActive
                userType
            }
        }
      }
      `,
    }).subscribe((result: any) => {
    //  console.log("RESO:E", result)
     this.router.navigate(['/home']);
    //  this.userData = result.data.getUserTypes.data
    });
    this.isLoading=false;
  }

  // Signup User Function
  async signupUser() {
    try{
      this.isLoading = true;
      // Create User in AWS Cognito
      const user = await Auth.signUp({
        username: this.signupForm.value.email,
        password: this.signupForm.value.password,
        attributes: {
          email: this.signupForm.value.email,
          phone_number: this.signupForm.value.phone
        },
      });

      if (user) {
        // Create User in Database
        this.createUserInDB();
      }
      this.router.navigate(['/home']);
      
    }catch(err) {
      this.isLoading = false;
      console.log(err)
    }
  }

  onSubmit() {
    // Signup Function Call
    // console.log("Signup HERE", this.signupForm.valid)
    this.signupUser();
  }

}