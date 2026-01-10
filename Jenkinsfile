pipeline {
    agent any

    options {
        timeout(time: 1, unit: 'HOURS')
        timestamps()
        buildDiscarder(logRotator(numToKeepStr: '10'))
        disableConcurrentBuilds()
    }

    environment {
        // Proje Ayarları
        APP_NAME = 'create-md-instructions-bot'
        DOCKER_IMAGE = "${APP_NAME}"
        NETWORK_NAME = 'app-network'
     
        CONTAINER_NAME = 'create-md-instructions-bot'
        APP_PORT = '3004'
        CONTAINER_PORT = '3004'
    }

    stages {
        stage('Clone Repository') {
            steps {
                script {
                    echo "🔄 Repository klonlanıyor..."
                    deleteDir() // Workspace temizleniyor

                    // Jenkins credentials ID'si
                    def gitCredsId = 'GITHUB_CREDENTIALS_ID' // Jenkins'te tanımlı credentials ID

                    withCredentials([usernamePassword(credentialsId: gitCredsId, passwordVariable: 'GIT_PASSWORD', usernameVariable: 'GIT_USERNAME')]) {
                        sh """
                            git clone --depth=1 https://\$GIT_USERNAME:\$GIT_PASSWORD@github.com/AFET-TEAM/Create-Md-Instructions-Bot.git repo || {
                                echo "❌ Git clone başarısız"
                                exit 1
                            }
                            cd repo
                            git config user.email "jenkins@example.com"
                            git config user.name "Jenkins CI"
                        """
                    }

                    // Çalışma dizinini repo içine taşıyoruz
                    dir('repo') {
                        echo "✅ Repository başarıyla klonlandı"
                    }
                }
            }
        }

        stage('Detect Environment') {
            steps {
                dir('repo') {
                    script {
                        echo "🔍 Ortam tespit ediliyor..."
                        def branchName = sh(returnStdout: true, script: 'git rev-parse --abbrev-ref HEAD').trim()
                        echo "📌 Branch: ${branchName}"

                        if (branchName == 'main' || branchName == 'master') {
                            env.CONTAINER_NAME = "${APP_NAME}-prod"
                            env.APP_PORT = "3004"
                            echo "✅ PROD Ortamı Seçildi (Port: 3004)"
                        } else if (branchName == 'develop') {
                            env.CONTAINER_NAME = "${APP_NAME}-dev"
                            env.APP_PORT = "3004"
                            echo "✅ DEV Ortamı Seçildi (Port: 3004)"
                        } else {
                            env.CONTAINER_NAME = "${APP_NAME}-test"
                            env.APP_PORT = "3004"
                            echo "✅ TEST Ortamı Seçildi (Port: 3004)"
                        }
                    }
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                dir('repo') {
                    script {
                        echo "🐳 Docker image oluşturuluyor..."
                        sh '''
                            set -e
                            docker build \
                                -t ${DOCKER_IMAGE}:${BUILD_NUMBER} \
                                -t ${DOCKER_IMAGE}:latest .
                            echo "✅ Docker image başarıyla oluşturuldu"
                        '''
                    }
                }
            }
        }

        stage('Stop Old Container') {
            steps {
                script {
                    echo "🛑 Eski container durduruluyor..."
                    sh '''
                        if docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
                            docker stop ${CONTAINER_NAME} 2>/dev/null || true
                            docker rm ${CONTAINER_NAME} 2>/dev/null || true
                            echo "✅ Eski container kaldırıldı"
                        else
                            echo "ℹ️ Eski container bulunamadı"
                        fi
                    '''
                }
            }
        }

        stage('Create Network') {
            steps {
                script {
                    echo "🌐 Docker network kontrol ediliyor..."
                    sh '''
                        if ! docker network ls --format '{{.Name}}' | grep -q "^${NETWORK_NAME}$"; then
                            docker network create ${NETWORK_NAME}
                            echo "✅ Network oluşturuldu"
                        else
                            echo "✅ Network zaten mevcut"
                        fi
                    '''
                }
            }
        }

        stage('Run New Container') {
            steps {
                script {
                    echo "▶️ Yeni container başlatılıyor..."
                    sh '''
                        set -e
                        docker run -d \
                            --name ${CONTAINER_NAME} \
                            --network ${NETWORK_NAME} \
                            -p ${APP_PORT}:${CONTAINER_PORT} \
                            ${DOCKER_IMAGE}:latest
                        echo "✅ Container başarıyla başlatıldı"
                        echo "🔗 URL: http://localhost:${APP_PORT}"
                        sleep 5
                    '''
                }
            }
        }

        stage('Health Check') {
            steps {
                script {
                    echo "💚 Health check yapılıyor..."
                    sh '''
                        for i in {1..30}; do
                            echo "Deneme $i/30..."
                            if curl -f http://localhost:${APP_PORT} > /dev/null 2>&1; then
                                echo "✅ Application sağlıklı, yanıt veriyor"
                                exit 0
                            fi
                            sleep 2
                        done
                        echo "❌ Application yanıt vermiyor"
                        exit 1
                    '''
                }
            }
        }
    }

    post {
        success {
            script {
                echo """
                ✅ PIPELINE BAŞARILI!
                📊 Deployment Detayları:
                - Container: ${env.CONTAINER_NAME}
                - Port: ${env.APP_PORT}
                - Image: ${env.DOCKER_IMAGE}:latest
                - URL: http://localhost:${env.APP_PORT}
                """
            }
        }

        failure {
            script {
                echo """
                ❌ PIPELINE BAŞARISIZ!
                🔍 Sorun Giderme:
                1. Container logs kontrol et: docker logs ${CONTAINER_NAME}
                2. Network kontrol: docker network ls
                3. Image kontrol: docker images | grep ${DOCKER_IMAGE}
                """
                sh '''
                    echo "Container logs:"
                    docker logs ${CONTAINER_NAME} 2>/dev/null || echo "Container not found"
                '''
            }
        }

        always {
            script {
                echo "Pipeline execution finished at " + new Date()
            }
        }
    }
}