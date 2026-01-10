pipeline {
    agent any
    
    options {
        timeout(time: 1, unit: 'HOURS')
        timestamps()
        buildDiscarder(logRotator(numToKeepStr: '10'))
        disableConcurrentBuilds()
    }
    
    environment {
        APP_NAME = 'create-md-instructions-bot'
        DOCKER_IMAGE = 'create-md-instructions-bot'
        CONTAINER_NAME = 'create-md-instructions-bot'
        APP_PORT = '3004'
        NETWORK_NAME = 'app-network'
    }
    
    stages {
        stage('Clone Repository') {
            steps {
                script {
                    echo "🔄 Repository klonlanıyor..."
                    deleteDir()
                    sh '''
                        git clone --depth=1 https://github.com/AFET-TEAM/Create-Md-Instructions-Bot-.git . || {
                            echo "❌ Git clone başarısız"
                            exit 1
                        }
                        git config user.email "jenkins@example.com"
                        git config user.name "Jenkins CI"
                    '''
                    echo "✅ Repository başarıyla klonlandı"
                }
            }
        }
        
        stage('Build Docker Image') {
            steps {
                script {
                    echo "🐳 Docker image oluşturuluyor..."
                    sh '''
                        set -e
                        docker build -t create-md-instructions-bot:latest .
                        echo "✅ Docker image başarıyla oluşturuldu"
                    '''
                }
            }
        }
        
        stage('Stop Old Container') {
            steps {
                script {
                    echo "🛑 Eski container durduruluyor..."
                    sh '''
                        CONTAINER_NAME="create-md-instructions-bot"
                        if docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
                            echo "Eski container durduruluyor..."
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
                        NETWORK_NAME="app-network"
                        if ! docker network ls --format '{{.Name}}' | grep -q "^${NETWORK_NAME}$"; then
                            echo "Network oluşturuluyor..."
                            docker network create ${NETWORK_NAME}
                            echo "✅ Network oluşturuldu"
                        else
                            echo "✅ Network zaten mevcut"
                        fi
                    '''
                }
            }
        }
        
        stage('Run Container') {
            steps {
                script {
                    echo "▶️ Container başlatılıyor..."
                    sh '''
                        set -e
                        CONTAINER_NAME="create-md-instructions-bot"
                        NETWORK_NAME="app-network"
                        APP_PORT="3004"
                        
                        docker run -d \
                            --name ${CONTAINER_NAME} \
                            --network ${NETWORK_NAME} \
                            -p ${APP_PORT}:3004 \
                            create-md-instructions-bot:latest
                        
                        echo "✅ Container başarıyla başlatıldı"
                        echo "🔗 URL: http://localhost:${APP_PORT}"
                        sleep 3
                    '''
                }
            }
        }
        
        stage('Health Check') {
            steps {
                script {
                    echo "💚 Health check yapılıyor..."
                    sh '''
                        APP_PORT="3004"
                        MAX_ATTEMPTS=30
                        ATTEMPT=0
                        
                        while [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do
                            ATTEMPT=$((ATTEMPT + 1))
                            echo "Deneme $ATTEMPT/$MAX_ATTEMPTS..."
                            
                            if curl -f http://localhost:${APP_PORT} > /dev/null 2>&1; then
                                echo "✅ Application sağlıklı, yanıt veriyor"
                                exit 0
                            fi
                            sleep 2
                        done
                        
                        echo "❌ Application yanıt vermiyor"
                        docker logs create-md-instructions-bot || true
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
                
                📊 Deployment Bilgileri:
                - Container: create-md-instructions-bot
                - Port: 3004
                - Image: create-md-instructions-bot:latest
                - URL: http://localhost:3004
                """
            }
        }
        
        failure {
            script {
                echo "❌ PIPELINE BAŞARISIZ!"
                sh '''
                    echo "📋 Container logs:"
                    docker logs create-md-instructions-bot 2>/dev/null || echo "Container not found"
                '''
            }
        }
        
        always {
            script {
                echo "Pipeline execution finished"
            }
        }
    }
}
