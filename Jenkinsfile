pipeline {
    agent any
    
    // Jenkins konfigürasyonu
    options {
        timeout(time: 1, unit: 'HOURS')
        timestamps()
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }
    
    environment {
        // Proje Ayarları
        APP_NAME = 'create-md-instructions-bot'
        DOCKER_IMAGE = "${APP_NAME}"
        GITHUB_REPO = 'https://github.com/AFET-TEAM/Create-Md-Instructions-Bot-.git'
        // Network
        NETWORK_NAME = 'app-network'
    }
    
    stages {
        stage('SCM Checkout') {
            steps {
                script {
                    echo ">>> Git repository checkout ediliyor..."
                    // Jenkins SCM konfigürasyonundan checkout yap
                    checkout scm
                    echo "✅ Repository başarıyla checkout edildi"
                }
            }
        }
        
        stage('Ortam ve Port Analizi') {
            steps {
                script {
                    // BRANCH_NAME'i GIT_BRANCH'ten çıkar
                    def branchName = env.GIT_BRANCH?.replace('origin/', '') ?: 'main'
                    
                    if (branchName == 'main' || branchName == 'master') {
                        // --- PROD ---
                        env.CONTAINER_NAME = "${APP_NAME}-prod"
                        env.APP_PORT = "3004"
                        env.ENV_FILE = "/var/jenkins_home/create-md-instructions-bot.env"
                        echo "✅ CANLI ORTAM (PROD) Hazırlanıyor..."
                        echo "Container: ${env.CONTAINER_NAME}"
                        echo "Port: ${env.APP_PORT}"
                    }
                    else if (branchName == 'develop') {
                        // --- DEV ---
                        env.CONTAINER_NAME = "${APP_NAME}-dev"
                        env.APP_PORT = "3005"
                        env.ENV_FILE = "/var/jenkins_home/create-md-instructions-bot-dev.env"
                        echo "✅ GELİŞTİRME ORTAMI (DEV) Hazırlanıyor..."
                        echo "Container: ${env.CONTAINER_NAME}"
                        echo "Port: ${env.APP_PORT}"
                    }
                    else {
                        // --- TEST ---
                        env.CONTAINER_NAME = "${APP_NAME}-test-${branchName}"
                        env.APP_PORT = "3006"
                        env.ENV_FILE = "/var/jenkins_home/create-md-instructions-bot-test.env"
                        echo "✅ TEST ORTAMI Hazırlanıyor..."
                        echo "Container: ${env.CONTAINER_NAME}"
                        echo "Port: ${env.APP_PORT}"
                    }
                }
            }
        }

        stage('Load Environment') {
            steps {
                script {
                    echo ">>> Environment dosyası yükleniyor..."
                    if (fileExists(env.ENV_FILE)) {
                        echo "✅ Environment dosyası bulundu: ${env.ENV_FILE}"
                    } else {
                        echo "⚠️  Environment dosyası bulunamadı: ${env.ENV_FILE}"
                        echo "Varsayılan değerler kullanılacak..."
                    }
                }
            }
        }


        stage('Build Docker Image') {
            steps {
                script {
                    echo ">>> Docker image oluşturuluyor..."
                    sh '''
                        if [ -f ${ENV_FILE} ]; then
                            set -a
                            . ${ENV_FILE}
                            set +a
                        fi
                        docker build \
                            --build-arg GEMINI_API_KEY="${GEMINI_API_KEY:-}" \
                            --build-arg ENVIRONMENT="${ENVIRONMENT:-development}" \
                            -t ${DOCKER_IMAGE}:${BRANCH_NAME} \
                            -t ${DOCKER_IMAGE}:latest \
                            -t ${DOCKER_IMAGE}:${BUILD_NUMBER} .
                    '''
                    echo "✅ Docker image başarıyla oluşturuldu!"
                }
            }
        }

        stage('Prepare Network') {
            steps {
                script {
                    echo ">>> Docker network kontrol ediliyor..."
                    sh "docker network create ${NETWORK_NAME} || true"
                    echo "✅ Network hazır: ${NETWORK_NAME}"
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
                        
                        # Port kullanan tüm containers'ı durdur (güvenlik için)
                        PORT_CONTAINERS=$(docker ps -q --filter "publish=${APP_PORT}" 2>/dev/null || echo "")
                        if [ -n "$PORT_CONTAINERS" ]; then
                            echo ">>> Port ${APP_PORT}'de çalışan containers durduruluyor..."
                            docker stop $PORT_CONTAINERS || true
                            docker rm $PORT_CONTAINERS || true
                        fi
                    '''
                    echo "✅ Eski container temizlendi"
                }
            }
        }

        stage('Run New Container') {
            steps {
                script {
                    echo ">>> Yeni container başlatılıyor..."
                    sh '''
                        docker run -d \
                        --name ${CONTAINER_NAME} \
                        --network ${NETWORK_NAME} \
                        --restart always \
                        -p ${APP_PORT}:3004 \
                        $([ -f ${ENV_FILE} ] && echo "--env-file ${ENV_FILE}") \
                        ${DOCKER_IMAGE}:${BRANCH_NAME}
                    '''
                    echo "✅ Container başlatıldı: ${CONTAINER_NAME}"
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
                        docker logs ${CONTAINER_NAME} | tail -20 || true
                        
                        # Container'ın IP adresini bul
                        CONTAINER_IP=$(docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' ${CONTAINER_NAME})
                        echo ">>> Container IP: $CONTAINER_IP"
                        
                        # Health check'i retry ile yap
                        MAX_RETRIES=10
                        RETRY=0
                        while [ $RETRY -lt $MAX_RETRIES ]; do
                            echo ">>> Health check attempt $(($RETRY + 1))/$MAX_RETRIES"
                            
                            # Container IP üzerinden dene
                            if [ -n "$CONTAINER_IP" ] && curl -f -s --connect-timeout 2 http://${CONTAINER_IP}:3004/ > /dev/null 2>&1; then
                                echo "✅ Deployment başarılı!"
                                exit 0
                            fi
                            
                            # localhost üzerinden dene
                            if curl -f -s --connect-timeout 2 http://localhost:${APP_PORT}/ > /dev/null 2>&1; then
                                echo "✅ Deployment başarılı!"
                                exit 0
                            fi
                            
                            RETRY=$((RETRY + 1))
                            if [ $RETRY -lt $MAX_RETRIES ]; then
                                sleep 3
                            fi
                        done
                        
                        echo "⚠️  Health check timeout, container kontrol ediliyor..."
                        docker inspect ${CONTAINER_NAME} | grep -A 5 "State" || true
                        exit 1
                    '''
                }
            }
        }
    }
    
    post {
        success {
            script {
                echo "✅ Pipeline başarıyla tamamlandı!"
                echo "═══════════════════════════════════════"
                echo "Ortam: ${BRANCH_NAME}"
                echo "Container: ${CONTAINER_NAME}"
                echo "Port: ${APP_PORT}"
                echo "URL: http://localhost:${APP_PORT}"
                echo "═══════════════════════════════════════"
            }
        }
        failure {
            script {
                echo "❌ Pipeline başarısız oldu!"
                echo "Container logs:"
                sh "docker logs ${CONTAINER_NAME} || true"
                // Hata durumunda önceki container'ı geri başlat (varsa)
                sh "docker start ${CONTAINER_NAME} || true"
            }
        }
        always {
            script {
                echo "Pipeline execution completed"
            }
        }
    }
}
