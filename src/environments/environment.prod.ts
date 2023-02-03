let token=null;
token=localStorage.getItem("access_token");

export const environment = {
  production: true,
  apiUrl: 'http://ec2-18-217-147-94.us-east-2.compute.amazonaws.com:8082/graphql',
  _loginURL: "http://ec2-18-217-147-94.us-east-2.compute.amazonaws.com:8082/oauth/token",
  uploadImageURL: "http://ec2-18-217-147-94.us-east-2.compute.amazonaws.com:8082/api/v1/file/upload/",
  uploadPropertyImageURL: "http://ec2-18-217-147-94.us-east-2.compute.amazonaws.com:8082/api/v1/property/upload",
  // apiUrl: 'http://192.168.100.208:8082/graphql',
  headers : { 'Authorization': `Bearer ${token}`}
};
