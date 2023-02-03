pipeline {
    agent any
     options {
    buildDiscarder( logRotator( numToKeepStr: '5' ) )
  }
  parameters {
    string( name: 'ENVIRONMENT', defaultValue: '', description: 'Deploy application to TEST BED or PRODUCTION' )
    booleanParam( name: 'SKIP_BUILD', defaultValue: false, description: 'Skip build?' )
    booleanParam( name: 'SKIP_UNIT_TESTS', defaultValue: true, description: 'Skip tests?' )
    booleanParam( name: 'SKIP_DEPLOYMENT', defaultValue: false, description: 'Skip deployment to Testing Bed?' )
    booleanParam( name: 'CLEAN_WORKSPACE', defaultValue: false, description: 'Clean Workspace?' )
  }
    stages {
        stage('Installing Dependencies') {
            steps {
                echo "Installing.."
                sh "npm cache clean --force"
                sh "rm -rf node_modules"
                sh "npm install --force"
            }
        }

       
        stage('Unit Tests') {
            when{
                expression{
                    !params.SKIP_UNIT_TESTS
                }
            }
            steps {
                echo 'Testing..'
                catchError(buildResult: 'UNSTABLE'){
                    sh "npm run test"

                }

            }
            post {
                always {
                    junit '**/target/surefire-reports/TESTS-*.xml'
                }
            }
        }
        stage('Build') {
            when{
                expression{
                    !params.SKIP_BUILD
                }
            }
            steps {
                echo 'Building..'
                sh "npm run build"
            }
        }
        stage('Deploy') {
            when{
                expression{
                    !params.SKIP_DEPLOYMENT && params.ENVIRONMENT == 'TEST BED'
                }
            }
            steps {
                echo 'Deploying to Testing Bed..'
                sh "sudo rm -rf /var/www/html"
                sh "sudo cp -R ./dist/html /var/www/"
                sh "sudo service nginx restart"
            }
        }
    }
  
}