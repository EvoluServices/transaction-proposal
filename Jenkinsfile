#!groovy

library 'evo-pipeline-library@master'

pipeline {
  agent {
    dockerfile {
      filename 'Dockerfile.build'
      args '-u root:root'
      registryCredentialsId 'repos-evoluservices.com'
      label 'docker'
      registryUrl 'https://repos.evoluservices.com'
    }
  }

  stages {
    stage('Build and publish') {
      steps {
        script {
          withCredentials([
              sshUserPrivateKey(
                credentialsId: 'github-transaction-proposal-deploy-key',
                keyFileVariable: 'GITHUB_KEY'
          )]) {
            withEnv(["GIT_SSH_COMMAND=ssh -i $GITHUB_KEY -o StrictHostKeyChecking=no"]) {
                sh 'git config user.name jenkins'
                sh 'git config user.email jenkins@localhost'
                sh 'bundle install'
                sh './build-and-deploy.sh'
            }
          }
        }
      }
    }
  }
}
