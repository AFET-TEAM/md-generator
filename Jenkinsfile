pipeline {
    agent any

    environment {
        BASE_APP_NAME = "md-generator"
        NETWORK_NAME = "app-network"
        CONTAINER_NAME = "md-generator-prod"
        HOST_PORT = "5000"
        CONTAINER_PORT = "5000"
    }

    stages {

        stage('Prepare Environment') {
            steps {
                script {
                    echo "🔧 Ortam hazırlanıyor..."
                    sh '''
                        # Network'ü oluştur (zaten varsa hata vermez)
                        docker network create app-network 2>/dev/null || true
                        
                        # Eski container'ı temizle
                        docker rm -f md-generator-prod 2>/dev/null || true
                        
                        # Bekleme süresi
                        sleep 2
                        
                        echo "✅ Ortam hazır"
                    '''
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    echo "🐳 Docker image oluşturuluyor..."
                    sh """
                        docker build -t ${BASE_APP_NAME}:mainn .
                    """
                    echo "✅ Docker image hazır: ${BASE_APP_NAME}:mainn"
                }
            }
        }

        stage('Deploy Container') {
            steps {
                script {
                    echo "🚀 Container deploy ediliyor: ${CONTAINER_NAME}"

                    sh '''
                        # Final cleanup
                        docker rm -f md-generator-prod 2>/dev/null || true
                        sleep 1
                        
                        # Container'ı başlat
                        docker run -d \
                            --name md-generator-prod \
                            --network app-network \
                            --restart always \
                            -p 5000:5000 \
                            md-generator:mainn
                        
                        # Başlatılmasını bekle
                        sleep 3
                        
                        echo "✅ Başarıyla deploy edildi"
                    '''
                }
            }
        }


    }

    post {
        success {
            echo "🎉 Pipeline tamamlandı: ${CONTAINER_NAME} çalışıyor."
        }

        failure {
            echo "❌ Pipeline başarısız oldu!"
        }
    }
}