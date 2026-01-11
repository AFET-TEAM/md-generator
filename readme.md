# 🤖 AI Ruleset Generator - Proje Dokumentasyonu

## 📋 İçindekiler

1. [Proje Özeti](#proje-özeti)
2. [Proje Amacı](#proje-amacı)
3. [Teknik Mimarisi](#teknik-mimarisi)
4. [Kullanıcı Akışı](#kullanıcı-akışı)
5. [Temel Bileşenler](#temel-bileşenler)
6. [İş Mantığı](#iş-mantığı)
7. [Kullanılan Teknolojiler](#kullanılan-teknolojiler)
8. [Kurulum ve Çalıştırma](#kurulum-ve-çalıştırma)

---

## 🎯 Proje Özeti

**Adı:** AI Ruleset Generator (AI Kural Seti Oluşturucu)  
**Tür:** Web Uygulaması (React Frontend)  
**Dil:** JavaScript (React 18.2.0)  
**Amaç:** Proje parametrelerini alarak AI asistanları için kural setleri (ruleset) otomatik olarak oluşturmak

---

## 💡 Proje Amacı

Bu proje, yazılım geliştirme projelerinin özelliklerini ekrandan forma girerek, **AI asistanları ve yazılım geliştirme araçları için kurallandırılmış talimatlar (instructions)** otomatik olarak oluşturmayı amaçlamaktadır.

### Temel Kullanım Senaryosu:

1. **Geliştirici** proje hakkında bilgileri forma girer:

   - Proje tipi (Frontend, Backend, Fullstack)
   - Kullanılan teknolojiler (React, Node.js, vb.)
   - Kod stili ve best practices
   - Test gereksinimleri
   - Deployment platformu
   - Ek özel gereksinimler

2. **Backend API** girilen parametreleri işler ve **AI (Google Gemini, OpenAI veya Ollama)** kullanarak:

   - Projenin ihtiyaçlarına uygun detaylı kurallar
   - Best practice rehberi
   - Kod standartları
   - Güvenlik ve performans önerileri
   - Test ve deployment talimatları

3. **Oluşturulan ruleset** iki formatta sunulur:

   - **Markdown Formatı:** İnsan tarafından okunabilir, güzel biçimlendirilmiş
   - **JSON Formatı:** Programlar tarafından işlenebilir, yapılandırılmış

4. **Kullanıcı** son ruleset'i:
   - İndirebilir (Markdown veya JSON)
   - Panoya kopyalayabilir
   - AI asistanlarına (ChatGPT, Claude, vs.) sistem promptu olarak kullanabilir

---

## 🏗️ Teknik Mimarisi

```
┌─────────────────────────────────────────────────────────┐
│         React Frontend (Create React App)               │
│   Port: 3000 (Development) / 5000 (Production)          │
└────────────┬────────────────────────────────────────────┘
             │ HTTP (Axios)
             ▼
┌─────────────────────────────────────────────────────────┐
│    Backend API (Python FastAPI/Django)                  │
│    https://ai-ruleset-backend.onrender.com              │
│                                                          │
│  ├─ /health (API sağlık kontrolü)                      │
│  ├─ /project-categories (Kategori ve seçenekler)      │
│  └─ /generate-ruleset (Ruleset oluşturma)             │
└────────────┬────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────┐
│              AI Service Provider (Seçili)               │
│                                                          │
│  ├─ Google Gemini API                                   │
│  ├─ OpenAI API                                          │
│  └─ Ollama (Lokal AI Model)                             │
└─────────────────────────────────────────────────────────┘
```

### İletişim Protokolü:

```
Frontend → Backend: POST /generate-ruleset
Veri: {
  project_category,
  project_type,
  frontend_framework (eğer frontend ise),
  backend_framework (eğer backend ise),
  code_style,
  testing_requirement,
  deployment_platform,
  additional_requirements,
  notes
}

Backend → AI Provider: Prompt + Parametreler
AI Provider → Backend: Oluşturulmuş Ruleset

Backend → Frontend: Response {
  markdown: "Markdown formatı...",
  json_data: { structured data }
}

Frontend: Gösterim ve İndirme
```

---

## 👥 Kullanıcı Akışı

### 1️⃣ Adım: Uygulamaya Giriş

- Header bölümünde "🤖 AI Ruleset Generator" başlığı görülür
- Backend API'nin sağlık durumu ve AI sağlayıcı bilgisi gösterilir

### 2️⃣ Adım: Form Doldurma

Kullanıcı **ProjectForm** bileşeniyle:

#### **Genel Bilgiler (Common)**

- **Proje Kategorisi:** Frontend, Backend, Fullstack
- **Proje Tipi:** Web Uygulaması, Mobil App, API, CLI Tool

#### **Frontend (Eğer Frontend seçilirse)**

- **Framework:** React, Vue.js, Angular, Svelte, Next.js
- **Stil Yaklaşımı:** CSS, SCSS, Styled Components, Tailwind CSS
- **State Management:** useState, Zustand, Redux Toolkit, TanStack Query
- **HTTP Client:** Fetch API, Axios, TanStack Query, SWR
- **UI Library:** Material-UI, Ant Design, Chakra UI
- **Build Tool:** Vite, Webpack, Create React App, Next.js
- **Test Framework:** Jest, Vitest, Cypress, Playwright

#### **Backend (Eğer Backend seçilirse)**

- **Dil:** Python, JavaScript/Node.js, Java, C#, Go
- **Framework:** FastAPI, Django, Express.js, Spring Boot
- **Veritabanı:** PostgreSQL, MySQL, MongoDB, Redis
- **Auth Yöntemi:** JWT, Session-based, OAuth 2.0, Auth0
- **API Stili:** REST, GraphQL, gRPC
- **ORM Tool:** Prisma, TypeORM, Sequelize, SQLAlchemy

#### **Ek Seçenekler**

- **Kod Stili:** Standard, Prettier, ESLint, Airbnb
- **Test Gereksinimleri:** Checkbox (Evet/Hayır)
- **Deployment Platformu:** AWS, Vercel, Netlify, Heroku
- **Ek Gereksinimler:** Dinamik liste (Ekle/Kaldır)
- **Notlar:** Serbest metin alanı

### 3️⃣ Adım: Ruleset Oluşturma

- Kullanıcı "Ruleset Oluştur" butonuna tıklar
- **LoadingSpinner** gösterilir
- Backend API'ye POST isteği gönderilir:
  ```
  POST https://ai-ruleset-backend.onrender.com/generate-ruleset
  Body: { Doldurulmuş form verileri }
  ```
- Backend, AI provider'a istek gönderir
- AI, girilen parametrelere uygun kurallar üretir

### 4️⃣ Adım: Sonuç Görüntüleme

**RulesetDisplay** bileşeni gösterilir:

- **Markdown Görünümü:**

  - Formatlanmış, okunabilir ruleset
  - Başlıklar, listeler, kod blokları
  - Syntax highlighting

- **JSON Görünümü:**
  - Yapılandırılmış veri
  - Programlar tarafından işlenebilir

### 5️⃣ Adım: Export ve Kullanım

Kullanıcı:

- ✅ **Markdown İndir:** `project-ruleset.md` dosyası indirir
- ✅ **JSON İndir:** `project-ruleset.json` dosyası indirir
- ✅ **Panoya Kopyala:** İçeriği kopyalayıp başka yere yapıştırır
- ✅ **Yeni Ruleset:** Form sıfırlanır, yeni proje için işlem başlar

---

## 🧩 Temel Bileşenler

### 1. **App.js** (Ana Bileşen)

```javascript
├── State Management:
│   ├── ruleset: Oluşturulan ruleset
│   ├── loading: Yükleme durumu
│   ├── error: Hata mesajı
│   └── apiStatus: Backend API durumu
│
├── Lifecycle:
│   └── useEffect: API sağlık kontrolü
│
├── Functions:
│   ├── handleFormSubmit(): Backend'e istek gönder
│   └── handleReset(): Form sıfırla
│
└── Render:
    ├── Header (başlık + API durumu)
    ├── ProjectForm (forma göre)
    ├── RulesetDisplay (sonuç gösterime)
    └── LoadingSpinner (yükleme sırasında)
```

**Sorumlulukları:**

- Tüm state'i merkezi olarak yönetme
- Form ve sonuç gösterimi arasında geçiş yapma
- API iletişimi koordine etme
- Hata yönetimi

---

### 2. **ProjectForm.js** (Form Bileşeni)

```javascript
├── State:
│   ├── formData: Tüm form alanları
│   ├── projectOptions: API'den gelen seçenekler
│   └── additionalRequirement: Ek gereksinim input
│
├── Lifecycle:
│   └── useEffect: Seçenekleri API'den yükle
│
├── Functions:
│   ├── handleInputChange(): Form alanı değişimi
│   ├── handleAddRequirement(): Ek gereksinim ekle
│   ├── handleRemoveRequirement(): Ek gereksinim kaldır
│   ├── handleSubmit(): Form gönder
│   ├── renderFrontendFields(): Frontend alanları
│   └── renderBackendFields(): Backend alanları
│
└── Render:
    ├── Kategori seçimi
    ├── Frontend alanları (koşullu)
    ├── Backend alanları (koşullu)
    ├── Ortak alanlar
    └── Gönder butonu
```

**Sorumlulukları:**

- Form alanlarını dinamik olarak render etme
- Kategori seçimine göre alanları göster/gizle
- Form validasyonu
- Ek gereksinimler listesi yönetme
- Verileri parent'a gönderme

---

### 3. **RulesetDisplay.js** (Sonuç Gösterimi)

```javascript
├── State:
│   └── viewMode: 'markdown' | 'json'
│
├── Functions:
│   ├── downloadFile(): Dosya indir
│   ├── handleDownloadMarkdown(): Markdown indir
│   ├── handleDownloadJSON(): JSON indir
│   └── copyToClipboard(): Panoya kopyala
│
└── Render:
    ├── Action Buttons:
    │   ├── Markdown Görünümü
    │   ├── JSON Görünümü
    │   ├── Markdown İndir
    │   ├── JSON İndir
    │   ├── Panoya Kopyala
    │   └── Yeni Ruleset
    │
    └── Content:
        ├── Markdown: ReactMarkdown ile render
        └── JSON: <pre> etiketi içinde pretty-print
```

**Sorumlulukları:**

- İki görünüm modu sunma (Markdown/JSON)
- İndir işlevi
- Panoya kopyalama
- Sıfırlama işlemi

---

### 4. **LoadingSpinner.js** (Yükleme Göstergesi)

- Animasyonlu spinner gösterir
- Backend API'den yanıt beklenirken gösterilir
- UX iyileştirmesi için kullanıcıya işlem devam ediyor sinyali verir

---

## 🔄 İş Mantığı

### **Ruleset Oluşturma İşlemi (Detaylı)**

```
1. USER INTERACTION (Kullanıcı Etkileşimi)
   └─ ProjectForm'daki form doldurulur
   └─ "Ruleset Oluştur" butonuna tıklanır

2. FORM SUBMISSION (Form Gönderimi)
   └─ handleFormSubmit() çağrılır
   └─ Loading = true (spinner başlar)

3. API REQUEST (API İsteği)
   └─ axios.post(`${API_BASE_URL}/generate-ruleset`, projectData)
   └─ Veri formatı:
      {
        project_category: "frontend" | "backend" | "fullstack",
        project_type: "Web Application" | "Mobile App" | ...,

        // Frontend (eğer kategori frontend ise)
        frontend_framework: "React" | "Vue.js" | ...,
        styling_approach: "Tailwind CSS" | "SCSS" | ...,
        state_management: "Redux Toolkit" | "Zustand" | ...,
        http_client: "Axios" | "Fetch API" | ...,
        ui_library: "Material-UI" | "Chakra UI" | ...,
        build_tool: "Vite" | "Webpack" | ...,
        testing_framework: "Jest" | "Cypress" | ...,

        // Backend (eğer kategori backend ise)
        backend_language: "Python" | "JavaScript" | ...,
        backend_framework: "FastAPI" | "Express.js" | ...,
        database_type: "PostgreSQL" | "MongoDB" | ...,
        auth_method: "JWT" | "OAuth 2.0" | ...,
        api_style: "REST" | "GraphQL" | ...,
        orm_tool: "Prisma" | "SQLAlchemy" | ...,

        // Ortak
        code_style: "Prettier" | "ESLint" | ...,
        testing_requirement: true | false,
        deployment_platform: "AWS" | "Vercel" | ...,
        additional_requirements: ["req1", "req2", ...],
        notes: "Ek notlar..."
      }

4. BACKEND PROCESSING (Backend İşlemi)
   └─ API endpoint: POST /generate-ruleset
   └─ İşlemler:
      a) Gelen verileri validate et
      b) Parametreleri AI prompt'a format et
      c) Seçilen AI provider'a (Gemini/OpenAI/Ollama) gönder
      d) AI response'ını al
      e) Markdown ve JSON'a dönüştür
      f) Response'ı frontend'e gönder

5. AI PROVIDER REQUEST (AI İstek)
   └─ Prompt örneği:
      "
      Bu proje için bir ruleset oluştur:
      - Framework: React 18
      - Stil: Tailwind CSS
      - State: Zustand
      - Test: Jest + Cypress
      - Deployment: Vercel

      İçermesi gereken:
      - Kod yazma standartları
      - Dosya yapısı
      - Component patterns
      - Best practices
      - Testing strategy
      - Deployment checklist
      "
   └─ AI response: Detaylı, yapılandırılmış rehber

6. RESPONSE PROCESSING (Sonuç İşlemi)
   └─ Backend, AI response'ını işler:
      - Markdown: Güzel biçimlendirilmiş metin
      - JSON: Yapılandırılmış veri

7. FRONTEND UPDATE (Frontend Güncelleme)
   └─ Response alındı:
      {
        markdown: "# Ruleset\n\n## Framework...",
        json_data: { structured ruleset }
      }
   └─ setRuleset(response.data)
   └─ Loading = false (spinner durur)
   └─ RulesetDisplay bileşeni gösterilir

8. USER ACTIONS (Kullanıcı İşlemleri)
   └─ Markdown/JSON görüntüleme
   └─ Dosya indirme
   └─ Panoya kopyalama
   └─ Yeni ruleset oluşturma
```

---

## 🛠️ Kullanılan Teknolojiler

### **Frontend Stack**

| Teknoloji                | Versiyon | Amaç                         |
| ------------------------ | -------- | ---------------------------- |
| React                    | 18.2.0   | UI Framework                 |
| React DOM                | 18.2.0   | DOM Manipulation             |
| Axios                    | 1.6.0    | HTTP İstekleri               |
| React Router             | 6.8.0    | Routing (ilerisi için hazır) |
| React Markdown           | 9.0.0    | Markdown render              |
| Prism.js                 | 1.29.0   | Syntax highlighting          |
| React Syntax Highlighter | 15.5.0   | Code block styling           |
| Lucide React             | 0.292.0  | SVG Icons                    |

### **Build & Development**

| Araç                | Amaç                               |
| ------------------- | ---------------------------------- |
| Create React App    | Project scaffolding ve build setup |
| react-scripts 5.0.1 | Development server ve build tools  |
| Jest                | Unit Testing                       |

### **Backend (Harici)**

| Teknoloji                           | Amaç               |
| ----------------------------------- | ------------------ |
| Python FastAPI / Django             | REST API           |
| Google Gemini API / OpenAI / Ollama | AI Text Generation |
| Render.com                          | Backend hosting    |

---

## 📦 Kurulum ve Çalıştırma

### **Gereksinimler**

- Node.js 16+
- npm 8+
- Backend API çalışıyor olmalı

### **Installation**

```bash
# Bağımlılıkları yükle
npm install

# Development server başlat
npm start
# http://localhost:3000

# Production build
npm run build

# Test çalıştır
npm test
```

### **Environment Setup**

```javascript
// src/config/api.js
const API_BASE_URL = "https://ai-ruleset-backend.onrender.com";
// Lokal geliştirme için:
// const API_BASE_URL = 'http://localhost:8000'
```

### **Docker ile Çalıştırma**

```dockerfile
# Dockerfile mevcuttur
docker build -t md-generator .
docker run -p 5000:5000 md-generator
```

### **Jenkins CI/CD**

```groovy
// Jenkinsfile mevcuttur
// Otomatik build, test ve deployment
docker run -p 5000:5000 --name md-generator-prod \
  --network app-network --restart always md-generator:mainn
```

---

## 🎨 Kullanıcı Arayüzü (UI)

### **Header Bölümü**

```
┌─────────────────────────────────────────────┐
│  🤖 AI Ruleset Generator                   │
│  Proje tercihlerinizi AI asistanları için  │
│  kurallar setine dönüştürün                │
│                                             │
│  🔧 AI Provider: OpenAI ✅ Yapılandırılmış │
└─────────────────────────────────────────────┘
```

### **Form Bölümü**

```
┌─────────────────────────────────────────────┐
│  📋 Proje Bilgileri                        │
│                                             │
│  Proje Kategorisi: [Frontend▼]             │
│  Proje Tipi: [Web Application▼]            │
│                                             │
│  🎨 Frontend Ayarları                       │
│  Framework: [React▼]                       │
│  Stil: [Tailwind CSS▼]                     │
│  State: [Zustand▼]                         │
│  HTTP: [Axios▼]                            │
│  UI Lib: [None▼]                           │
│  Build: [Vite▼]                            │
│  Test: [Vitest▼]                           │
│                                             │
│  ⚙️ Ek Ayarlar                              │
│  Kod Stili: [Prettier▼]                    │
│  Test Gerekli: [☑]                         │
│  Deployment: [Vercel▼]                     │
│  Ek Gereksinimler: [Ekle...]               │
│  Notlar: [Serbest metin...]                │
│                                             │
│  [Ruleset Oluştur]                         │
└─────────────────────────────────────────────┘
```

### **Sonuç Bölümü**

````
┌─────────────────────────────────────────────┐
│ [📝 Markdown] [🔧 JSON] [📥 MD] [📥 JSON]  │
│ [📋 Kopyala] [🔄 Yeni]                     │
├─────────────────────────────────────────────┤
│                                             │
│  # React Frontend Ruleset                  │
│                                             │
│  ## Framework Setup                         │
│  - React 18.2.0 ile başla                  │
│  - TypeScript tercih et                    │
│  - Vite build tool kullan                  │
│                                             │
│  ## State Management                        │
│  - Zustand kullan                          │
│  - Store structure:                        │
│    ```javascript                           │
│    create((set) => ({ ... }))              │
│    ```                                     │
│                                             │
│  ## Styling                                 │
│  - Tailwind CSS sınıflarını kullan         │
│  - Responsive design zorunlu                │
│  - Dark mode support ekle                  │
│                                             │
│  [... daha fazla içerik ...]               │
│                                             │
└─────────────────────────────────────────────┘
````

---

## 🚀 Gelecek Geliştirmeler

- [ ] Proje şablonları kütüphanesi
- [ ] Real-time collaboration
- [ ] Version control ve history
- [ ] Team workspaces
- [ ] Custom AI prompt editor
- [ ] Ruleset templates marketplace
- [ ] Integration dengan GitHub/GitLab



**Son Güncelleme:** 11 Ocak 2026  
**Versiyon:** 1.0.0
