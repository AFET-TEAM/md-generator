// Predefined skill catalog for multi-agent configuration
const SKILL_CATEGORIES = [
  {
    id: 'code',
    name: 'Kod',
    icon: 'code',
    skills: [
      { id: 'code-generation', name: 'Kod Uretimi', description: 'Yeni kod yazma ve snippet olusturma' },
      { id: 'code-review', name: 'Kod Inceleme', description: 'Kod kalitesi, best practice ve hata kontrolu' },
      { id: 'refactoring', name: 'Refactoring', description: 'Mevcut kodu iyilestirme ve temizleme' },
      { id: 'debugging', name: 'Debugging', description: 'Hata bulma ve duzeltme' },
      { id: 'code-completion', name: 'Kod Tamamlama', description: 'Otomatik kod tamamlama ve oneri' },
    ]
  },
  {
    id: 'testing',
    name: 'Test',
    icon: 'test-tube',
    skills: [
      { id: 'unit-testing', name: 'Unit Test', description: 'Birim test yazma ve calistirma' },
      { id: 'integration-testing', name: 'Entegrasyon Testi', description: 'Entegrasyon testleri olusturma' },
      { id: 'e2e-testing', name: 'E2E Test', description: 'Uctan uca test senaryolari' },
      { id: 'test-generation', name: 'Test Uretimi', description: 'Otomatik test case olusturma' },
      { id: 'coverage-analysis', name: 'Kapsam Analizi', description: 'Test kapsam analizi ve raporlama' },
    ]
  },
  {
    id: 'documentation',
    name: 'Dokumantasyon',
    icon: 'file-text',
    skills: [
      { id: 'docstring', name: 'Docstring', description: 'Fonksiyon ve sinif dokumantasyonu' },
      { id: 'readme-gen', name: 'README Olusturma', description: 'Proje README dosyasi olusturma' },
      { id: 'api-docs', name: 'API Dokumantasyonu', description: 'API endpoint dokumantasyonu' },
      { id: 'changelog', name: 'Changelog', description: 'Degisiklik kaydi tutma' },
      { id: 'architecture-docs', name: 'Mimari Dokuman', description: 'Sistem mimarisi dokumantasyonu' },
    ]
  },
  {
    id: 'devops',
    name: 'DevOps',
    icon: 'settings',
    skills: [
      { id: 'ci-cd', name: 'CI/CD', description: 'Pipeline olusturma ve yonetimi' },
      { id: 'docker', name: 'Docker', description: 'Container yapilandirma ve optimizasyon' },
      { id: 'deployment', name: 'Deployment', description: 'Uygulama dagitimi ve yapilandirma' },
      { id: 'monitoring', name: 'Izleme', description: 'Uygulama izleme ve loglama' },
      { id: 'infrastructure', name: 'Altyapi', description: 'Altyapi yonetimi ve IaC' },
    ]
  },
  {
    id: 'security',
    name: 'Guvenlik',
    icon: 'shield',
    skills: [
      { id: 'vulnerability-scan', name: 'Zafiyet Taramasi', description: 'Guvenlik acigi taramasi' },
      { id: 'security-review', name: 'Guvenlik Incelemesi', description: 'Kod guvenlik analizi' },
      { id: 'dependency-audit', name: 'Bagimsizlik Denetimi', description: 'Dependency guvenlik kontrolu' },
      { id: 'auth-implementation', name: 'Kimlik Dogrulama', description: 'Auth akislari uygulama' },
      { id: 'data-protection', name: 'Veri Koruma', description: 'Veri sifreleme ve koruma' },
    ]
  },
  {
    id: 'architecture',
    name: 'Mimari',
    icon: 'layout',
    skills: [
      { id: 'design-patterns', name: 'Tasarim Desenleri', description: 'Design pattern uygulama' },
      { id: 'system-design', name: 'Sistem Tasarimi', description: 'Sistem mimarisi tasarimi' },
      { id: 'database-design', name: 'Veritabani Tasarimi', description: 'DB schema tasarimi' },
      { id: 'api-design', name: 'API Tasarimi', description: 'RESTful/GraphQL API tasarimi' },
      { id: 'microservices', name: 'Mikroservisler', description: 'Mikroservis mimarisi' },
    ]
  },
  {
    id: 'git',
    name: 'Git & Versiyon',
    icon: 'git-branch',
    skills: [
      { id: 'commit-messages', name: 'Commit Mesajlari', description: 'Anlamli commit mesajlari yazma' },
      { id: 'pr-descriptions', name: 'PR Aciklamalari', description: 'Pull request aciklamalari olusturma' },
      { id: 'branch-management', name: 'Branch Yonetimi', description: 'Git branch stratejisi' },
      { id: 'code-merging', name: 'Kod Birlestirme', description: 'Merge conflict cozumu' },
    ]
  },
  {
    id: 'performance',
    name: 'Performans',
    icon: 'zap',
    skills: [
      { id: 'optimization', name: 'Optimizasyon', description: 'Kod performans optimizasyonu' },
      { id: 'profiling', name: 'Profiling', description: 'Performans profilleme' },
      { id: 'caching', name: 'Onbellekleme', description: 'Cache stratejileri uygulama' },
      { id: 'lazy-loading', name: 'Lazy Loading', description: 'Tembel yukleme optimizasyonu' },
    ]
  }
];

// Predefined agent role templates
const AGENT_TEMPLATES = [
  {
    id: 'code-assistant',
    name: 'Kod Asistani',
    description: 'Genel amacli kod yazma ve duzenleme asistani',
    defaultSkills: ['code-generation', 'code-completion', 'refactoring', 'debugging'],
    icon: 'cpu'
  },
  {
    id: 'code-reviewer',
    name: 'Kod Gozden Gecirici',
    description: 'Kod kalitesi ve best practice kontrolu yapan ajan',
    defaultSkills: ['code-review', 'security-review', 'optimization', 'design-patterns'],
    icon: 'search'
  },
  {
    id: 'test-engineer',
    name: 'Test Muhendisi',
    description: 'Test yazma ve test stratejisi olusturan ajan',
    defaultSkills: ['unit-testing', 'integration-testing', 'e2e-testing', 'test-generation', 'coverage-analysis'],
    icon: 'check-circle'
  },
  {
    id: 'documenter',
    name: 'Dokumantasyon Uzmani',
    description: 'Kod ve proje dokumantasyonu olusturan ajan',
    defaultSkills: ['docstring', 'readme-gen', 'api-docs', 'changelog', 'architecture-docs'],
    icon: 'book-open'
  },
  {
    id: 'devops-engineer',
    name: 'DevOps Muhendisi',
    description: 'CI/CD, deployment ve altyapi yonetimi yapan ajan',
    defaultSkills: ['ci-cd', 'docker', 'deployment', 'monitoring', 'infrastructure'],
    icon: 'server'
  },
  {
    id: 'security-analyst',
    name: 'Guvenlik Analisti',
    description: 'Guvenlik analizi ve zafiyet taramasi yapan ajan',
    defaultSkills: ['vulnerability-scan', 'security-review', 'dependency-audit', 'auth-implementation', 'data-protection'],
    icon: 'shield'
  },
  {
    id: 'architect',
    name: 'Yazilim Mimari',
    description: 'Sistem ve yazilim mimarisi tasarlayan ajan',
    defaultSkills: ['system-design', 'design-patterns', 'database-design', 'api-design', 'microservices'],
    icon: 'layers'
  },
  {
    id: 'custom',
    name: 'Ozel Ajan',
    description: 'Kendi skill setinizi secebileceginiz ozel ajan',
    defaultSkills: [],
    icon: 'plus-circle'
  }
];

// Config file templates
const CONFIG_FILE_TYPES = [
  {
    id: 'copilot-instructions',
    name: '.github/copilot-instructions.md',
    description: 'GitHub Copilot genel talimatlar dosyasi',
    format: 'markdown',
    targetTool: 'GitHub Copilot'
  },
  {
    id: 'copilot-agents',
    name: '.github/copilot/agents.yml',
    description: 'GitHub Copilot multi-agent yapilandirma dosyasi',
    format: 'yaml',
    targetTool: 'GitHub Copilot'
  },
  {
    id: 'instructions-md',
    name: 'instructions.md',
    description: 'Genel AI asistan talimat dosyasi',
    format: 'markdown',
    targetTool: 'Genel'
  },
  {
    id: 'cursorrules',
    name: '.cursorrules',
    description: 'Cursor IDE kural dosyasi',
    format: 'markdown',
    targetTool: 'Cursor IDE'
  },
  {
    id: 'claude-instructions',
    name: 'CLAUDE.md',
    description: 'Claude Code proje talimat dosyasi',
    format: 'markdown',
    targetTool: 'Claude Code'
  },
  {
    id: 'windsurf-rules',
    name: '.windsurfrules',
    description: 'Windsurf IDE kural dosyasi',
    format: 'markdown',
    targetTool: 'Windsurf'
  }
];

export { SKILL_CATEGORIES, AGENT_TEMPLATES, CONFIG_FILE_TYPES };
