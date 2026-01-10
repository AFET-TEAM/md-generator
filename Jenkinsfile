pipeline {
    agent {
        docker {
            image 'node:18-alpine'
            args '-v /var/run/docker.sock:/var/run/docker.sock'
        }
    }
    
    environment {
        // Proje ayarları
        APP_NAME = 'create-md-instructions-bot'
        GITHUB_REPO = 'https://github.com/AFET-TEAM/Create-Md-Instructions-Bot-.git'
        DOCKER_IMAGE = "${APP_NAME}"
        CONTAINER_NAME = "${APP_NAME}-container"
    }
    
    stages {
        stage('Checkout') {
            steps {
                script {
                    echo ">>> Repository klonlanıyor..."
                    git branch: 'main', url: "${GITHUB_REPO}"
                }
            }
        }
        
        stage('Install Dependencies') {
            steps {
                script {
                    echo ">>> Dependencies yükleniyor..."
                    sh 'npm install'
                }
            }
        }
        
        stage('Build') {
            steps {
                script {
                    echo ">>> React uygulaması build ediliyor..."
                    sh 'npm run build'
                }
            }
        }
        
        stage('Build Docker Image') {
            steps {
                script {
                    echo ">>> Docker image oluşturuluyor..."
                    sh "docker build -t ${DOCKER_IMAGE}:latest -t ${DOCKER_IMAGE}:${BUILD_NUMBER} ."
                }
            }
        }
        
        stage('Stop Old Container') {
            steps {
                script {
                    echo ">>> Eski container durduruluyor..."
                    sh "docker stop ${CONTAINER_NAME} || true"
                    sh "docker rm ${CONTAINER_NAME} || true"
                }
            }
        }
        
        stage('Run New Container') {
            steps {
                script {
                    echo ">>> Yeni container başlatılıyor..."
                    sh """
                        docker run -d \
                        --name ${CONTAINER_NAME} \
                        --restart always \
                        -p 3002:3002 \
                        ${DOCKER_IMAGE}:latest
                    """
                }
            }
        }
        
        stage('Verify Deployment') {
            steps {
                script {
                    echo ">>> Deployment doğrulanıyor..."
                    sh "sleep 5 && docker exec ${CONTAINER_NAME} wget -O- http://localhost:3002/ || exit 1"
                }
            }
        }
    }
    
    post {
        success {
            echo "✅ Pipeline başarıyla tamamlandı!"
        }
        failure {
            echo "❌ Pipeline başarısız oldu!"
            // Hata durumunda önceki container'ı geri başlat
            sh "docker start ${CONTAINER_NAME} || true"
        }
    }
}
