pipeline {
    agent any

    environment {
        BASE_APP_NAME = "md-generator"
        NETWORK_NAME = "app-network"
        CONTAINER_NAME = "md-generator-prod"
        HOST_PORT = "5000"
        CONTAINER_PORT = "5001"
    }

    stages {

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

                 
                    sh """
                        docker stop ${CONTAINER_NAME} 2>/dev/null || true
                        docker rm ${CONTAINER_NAME} 2>/dev/null || true
                    """

           
                    sh """
                        docker run -d \
                            --name ${CONTAINER_NAME} \
                            --network ${NETWORK_NAME} \
                            --restart always \
                            -p ${HOST_PORT}:${CONTAINER_PORT} \
                            ${BASE_APP_NAME}:mainn
                    """

                    echo "✅ Başarıyla deploy edildi: ${CONTAINER_NAME} | Port: ${HOST_PORT}"
                }
            }
        }

        stage('Health Check') {
            steps {
                script {
                    echo "💚 Health check başlatılıyor..."
                    sh '''
                        CONTAINER_NAME="md-generator-prod"
                        for i in {1..15}; do
                            if docker exec ${CONTAINER_NAME} curl -f http://localhost:5001 > /dev/null 2>&1; then
                                echo "✅ Application çalışıyor"
                                exit 0
                            fi
                            echo "⏳ Bekleniyor... ($i/15)"
                            sleep 2
                        done
                        echo "❌ Application çalışmıyor"
                        exit 1
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