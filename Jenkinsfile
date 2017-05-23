pipeline {
  agent {
    docker {
      image 'node:6'
    }
    
  }
  stages {
    stage('NPM Dependencies') {
      steps {
        sh 'npm install'
      }
    }
  }
}