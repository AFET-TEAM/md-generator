pipeline {
    agent any
      environment {
        APP_NAME_API = " create-md-instructions-bot"
        NETWORK_NAME = "app-network"
    }
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
        GITHUB_REPO = 'https://github.com/AFET-TEAM/Create-Md-Instructions-Bot-.git'
        NETWORK_NAME = 'app-network'
   
        CONTAINER_NAME = 'create-md-instructions-bot-default'
        APP_PORT = '3004'
        CONTAINER_PORT = '3004'
        ENV_FILE = '/var/jenkins_home/create-md-instructions-bot.env'
    }
    
    stages {
        stage('Clone Repository') {
            steps {
                script {
                    echo "🔄 Repository klonlanıyor..."
                    deleteDir()
                    sh '''
                        git clone --depth=1 ${GITHUB_REPO} . || {
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
        
        stage('Detect Environment') {
            steps {
                script {
                    echo "🔍 Ortam tespit ediliyor..."
                    def branchName = sh(returnStdout: true, script: 'git rev-parse --abbrev-ref HEAD').trim()
                    echo "📌 Branch: ${branchName}"
                    
                    if (branchName == 'main' || branchName == 'master') {
                        env.CONTAINER_NAME = "${APP_NAME}-prod"
                        env.APP_PORT = "3004"
                        env.ENV_FILE = "/var/jenkins_home/create-md-instructions-bot.env"
                        echo "✅ PROD Ortamı Seçildi (Port: 3004)"
                    }
                    else if (branchName == 'develop') {
                        env.CONTAINER_NAME = "${APP_NAME}-dev"
                        env.APP_PORT = "3004"
                        env.ENV_FILE = "/var/jenkins_home/create-md-instructions-bot-dev.env"
                        echo "✅ DEV Ortamı Seçildi (Port: 3004)"
                    }
                    else {
                        env.CONTAINER_NAME = "${APP_NAME}-test"
                        env.APP_PORT = "3004"
                        env.ENV_FILE = "/var/jenkins_home/create-md-instructions-bot-test.env"
                        echo "✅ TEST Ortamı Seçildi (Port: 3004)"
                    }
                }
            }
        }
        
        stage('Load Environment Variables') {
            steps {
                script {
                    echo "📂 Environment dosyası yükleniyor: ${env.ENV_FILE}"
                    if (fileExists(env.ENV_FILE)) {
                        echo "✅ Environment dosyası bulundu"
                    } else {
                        echo "⚠️  Environment dosyası bulunamadı (varsayılan değerler kullanılacak)"
                    }
                }
            }
        }
        
        stage('Build Docker Image') {
            steps {
                script {
                    echo "🐳 Docker image oluşturuluyor..."
                    sh '''
                        set -e
                        
                        # Environment dosyasını yükle
                        if [ -f "${ENV_FILE}" ]; then
                            echo "Loading environment from ${ENV_FILE}"
                            export $(grep -v '^#' ${ENV_FILE} | xargs)
                        fi
                        
                        # Docker image oluştur
                        docker build \
                            --build-arg GEMINI_API_KEY="${GEMINI_API_KEY:-}" \
                            --build-arg ENVIRONMENT="${ENVIRONMENT:-development}" \
                            -t ${DOCKER_IMAGE}:${BUILD_NUMBER} \
                            -t ${DOCKER_IMAGE}:latest .
                        
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
                        if docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
                            echo "Eski container durduruluyor: ${CONTAINER_NAME}"
                            docker stop ${CONTAINER_NAME} 2>/dev/null || true
                            docker rm ${CONTAINER_NAME} 2>/dev/null || true
                            echo "✅ Eski container kaldırıldı"
                        else
                            echo "ℹ️  Eski container bulunamadı"
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
                            echo "Network oluşturuluyor: ${NETWORK_NAME}"
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
                    echo "▶️  Yeni container başlatılıyor..."
                    sh '''
                        set -e
                        
                        # Environment dosyasını yükle
                        ENV_ARGS=""
                        if [ -f "${ENV_FILE}" ]; then
                            ENV_ARGS=$(grep -v '^#' ${ENV_FILE} | sed 's/^/-e /' | tr '\n' ' ')
                        fi
                        
                        # Container'ı başlat
                        docker run -d \
                            --name ${CONTAINER_NAME} \
                            --network ${NETWORK_NAME} \
                            -p ${APP_PORT}:${CONTAINER_PORT} \
                            ${ENV_ARGS} \
                            ${DOCKER_IMAGE}:latest
                        
                        echo "✅ Container başarıyla başlatıldı"
                        echo "🔗 URL: http://localhost:${APP_PORT}"
                        
                        # Başlatılmasını bekle
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
                echo "Pipeline execution finished at $(date)"
            }
        }
    }
}
