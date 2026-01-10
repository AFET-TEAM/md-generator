pipeline {
    agent any
    
    environment {
        // Proje ayarları
        APP_NAME = 'create-md-instructions-bot'
        GITHUB_REPO = 'https://github.com/AFET-TEAM/Create-Md-Instructions-Bot-.git'
        DOCKER_IMAGE = "${APP_NAME}"
        CONTAINER_NAME = "${APP_NAME}-container"
    }
    
    stages {
        stage('Load Environment') {
            steps {
                script {
                    echo ">>> Environment dosyası yükleniyor..."
                    def envPath = '/var/jenkins_home/create-md-instructions-bot.env'
                    if (fileExists(envPath)) {
                        echo "✅ Environment dosyası bulundu: ${envPath}"
                    } else {
                        echo "⚠️  Environment dosyası bulunamadı: ${envPath}"
                        echo "Devam ediliyor varsayılan ortam ile..."
                    }
                }
            }
        }
        
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
                    echo ">>> Aşama atlanıyor (Dockerfile'da npm install yapılacak)..."
                }
            }
        }
        
        stage('Build') {
            steps {
                script {
                    echo ">>> Aşama atlanıyor (Dockerfile'da npm run build yapılacak)..."
                }
            }
        }
        
        stage('Build Docker Image') {
            steps {
                script {
                    echo ">>> Docker image oluşturuluyor..."
                    sh '''
                        if [ -f /var/jenkins_home/create-md-instructions-bot.env ]; then
                            set -a
                            . /var/jenkins_home/create-md-instructions-bot.env
                            set +a
                        fi
                        docker build \
                            --build-arg GEMINI_API_KEY="${GEMINI_API_KEY:-}" \
                            --build-arg ENVIRONMENT="${ENVIRONMENT:-development}" \
                            -t ${DOCKER_IMAGE}:latest \
                            -t ${DOCKER_IMAGE}:${BUILD_NUMBER} .
                    '''
                }
            }
        }
        
        stage('Stop Old Container') {
            steps {
                script {
                    echo ">>> Eski container durduruluyor..."
                    sh '''
                        # İsimle durmaya çalış
                        docker stop ${CONTAINER_NAME} 2>/dev/null || true
                        docker rm ${CONTAINER_NAME} 2>/dev/null || true
                        
                        # Port 3004'ü kullanan tüm containers'ı durdur
                        PORT_CONTAINERS=$(docker ps -q --filter "publish=3004" 2>/dev/null || echo "")
                        if [ -n "$PORT_CONTAINERS" ]; then
                            echo ">>> Port 3004'de çalışan containers durduruluyor..."
                            docker stop $PORT_CONTAINERS || true
                            docker rm $PORT_CONTAINERS || true
                        fi
                    '''
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
                        -p 3004:3004 \
                        --env-file /var/jenkins_home/create-md-instructions-bot.env \
                        ${DOCKER_IMAGE}:latest
                    """
                }
            }
        }
        
        stage('Verify Deployment') {
            steps {
                script {
                    echo ">>> Deployment doğrulanıyor..."
                    sh '''
                        # Container'ın başlaması için bekleme
                        sleep 15
                        
                        # Logs'ları kontrol et
                        echo ">>> Container logs:"
                        docker logs ${CONTAINER_NAME} || true
                        
                        # Health check'i retry ile yap
                        MAX_RETRIES=10
                        RETRY=0
                        while [ $RETRY -lt $MAX_RETRIES ]; do
                            echo ">>> Health check attempt $(($RETRY + 1))/$MAX_RETRIES"
                            if curl -f http://localhost:3004/ 2>/dev/null; then
                                echo "✅ Deployment başarılı!"
                                exit 0
                            fi
                            RETRY=$((RETRY + 1))
                            if [ $RETRY -lt $MAX_RETRIES ]; then
                                sleep 3
                            fi
                        done
                        
                        echo "❌ Health check başarısız!"
                        exit 1
                    '''
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
