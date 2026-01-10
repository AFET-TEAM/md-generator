import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProjectForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    // Genel bilgiler
    project_category: '',
    project_type: '',
    
    // Frontend özel alanlar
    frontend_framework: '',
    styling_approach: '',
    state_management: '',
    http_client: '',
    ui_library: '',
    build_tool: '',
    testing_framework: '',
    
    // Backend özel alanlar
    backend_language: '',
    backend_framework: '',
    database_type: '',
    auth_method: '',
    api_style: '',
    orm_tool: '',
    
    // Ortak alanlar
    code_style: '',
    testing_requirement: false,
    deployment_platform: '',
    additional_requirements: [],
    notes: ''
  });

  const [projectOptions, setProjectOptions] = useState({
    categories: [],
    frontend_options: {},
    backend_options: {},
    common_options: {}
  });

  const [additionalRequirement, setAdditionalRequirement] = useState('');

  useEffect(() => {
    // Load available options from API
    const loadOptions = async () => {
      try {
        const response = await axios.get('https://ai-ruleset-backend-1.onrender.com/project-categories');
        setProjectOptions(response.data);
      } catch (error) {
        console.error('Error loading options:', error);
        // Fallback data if API fails
        setProjectOptions({
          categories: ['frontend', 'backend', 'fullstack'],
          frontend_options: {
            frameworks: ['React', 'Vue.js', 'Angular', 'Svelte', 'Next.js'],
            styling_approaches: ['CSS', 'SCSS/SASS', 'Styled Components', 'Tailwind CSS'],
            state_management: ['useState', 'Zustand', 'Redux Toolkit', 'TanStack Query'],
            http_clients: ['Fetch API', 'Axios', 'TanStack Query', 'SWR'],
            ui_libraries: ['None', 'Material-UI', 'Ant Design', 'Chakra UI'],
            build_tools: ['Vite', 'Webpack', 'Next.js', 'Create React App'],
            testing_frameworks: ['Jest', 'Vitest', 'Cypress', 'Playwright']
          },
          backend_options: {
            languages: ['Python', 'JavaScript/Node.js', 'Java', 'C#', 'Go'],
            frameworks: ['FastAPI', 'Django', 'Express.js', 'Spring Boot'],
            databases: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis'],
            auth_methods: ['JWT', 'Session-based', 'OAuth 2.0', 'Auth0'],
            api_styles: ['REST', 'GraphQL', 'gRPC'],
            orm_tools: ['Prisma', 'TypeORM', 'Sequelize', 'SQLAlchemy']
          },
          common_options: {
            project_types: ['Web Application', 'Mobile App', 'API/Microservice', 'CLI Tool'],
            deployment_platforms: ['AWS', 'Vercel', 'Netlify', 'Heroku'],
            code_styles: ['Standard', 'Prettier', 'ESLint', 'Airbnb']
          }
        });
      }
    };

    loadOptions();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddRequirement = () => {
    if (additionalRequirement.trim()) {
      setFormData(prev => ({
        ...prev,
        additional_requirements: [...prev.additional_requirements, additionalRequirement.trim()]
      }));
      setAdditionalRequirement('');
    }
  };

  const handleRemoveRequirement = (index) => {
    setFormData(prev => ({
      ...prev,
      additional_requirements: prev.additional_requirements.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const renderFrontendFields = () => (
    <div className="category-fields">
      <h3>🎨 Frontend Ayarları</h3>
      
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="frontend_framework">Frontend Framework *</label>
          <select
            id="frontend_framework"
            name="frontend_framework"
            value={formData.frontend_framework}
            onChange={handleInputChange}
            required
          >
            <option value="">Seçiniz...</option>
            {projectOptions.frontend_options?.frameworks?.map(fw => (
              <option key={fw} value={fw}>{fw}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="styling_approach">Stil Yaklaşımı</label>
          <select
            id="styling_approach"
            name="styling_approach"
            value={formData.styling_approach}
            onChange={handleInputChange}
          >
            <option value="">Seçiniz...</option>
            {projectOptions.frontend_options?.styling_approaches?.map(style => (
              <option key={style} value={style}>{style}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="state_management">State Management</label>
          <select
            id="state_management"
            name="state_management"
            value={formData.state_management}
            onChange={handleInputChange}
          >
            <option value="">Seçiniz...</option>
            {projectOptions.frontend_options?.state_management?.map(sm => (
              <option key={sm} value={sm}>{sm}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="http_client">HTTP Client</label>
          <select
            id="http_client"
            name="http_client"
            value={formData.http_client}
            onChange={handleInputChange}
          >
            <option value="">Seçiniz...</option>
            {projectOptions.frontend_options?.http_clients?.map(client => (
              <option key={client} value={client}>{client}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="ui_library">UI Kütüphanesi</label>
          <select
            id="ui_library"
            name="ui_library"
            value={formData.ui_library}
            onChange={handleInputChange}
          >
            <option value="">Seçiniz...</option>
            {projectOptions.frontend_options?.ui_libraries?.map(lib => (
              <option key={lib} value={lib}>{lib}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="build_tool">Build Tool</label>
          <select
            id="build_tool"
            name="build_tool"
            value={formData.build_tool}
            onChange={handleInputChange}
          >
            <option value="">Seçiniz...</option>
            {projectOptions.frontend_options?.build_tools?.map(tool => (
              <option key={tool} value={tool}>{tool}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="testing_framework">Test Framework</label>
          <select
            id="testing_framework"
            name="testing_framework"
            value={formData.testing_framework}
            onChange={handleInputChange}
          >
            <option value="">Seçiniz...</option>
            {projectOptions.frontend_options?.testing_frameworks?.map(tf => (
              <option key={tf} value={tf}>{tf}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );

  const renderBackendFields = () => (
    <div className="category-fields">
      <h3>⚙️ Backend Ayarları</h3>
      
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="backend_language">Backend Dili *</label>
          <select
            id="backend_language"
            name="backend_language"
            value={formData.backend_language}
            onChange={handleInputChange}
            required
          >
            <option value="">Seçiniz...</option>
            {projectOptions.backend_options?.languages?.map(lang => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="backend_framework">Backend Framework</label>
          <select
            id="backend_framework"
            name="backend_framework"
            value={formData.backend_framework}
            onChange={handleInputChange}
          >
            <option value="">Seçiniz...</option>
            {projectOptions.backend_options?.frameworks?.map(fw => (
              <option key={fw} value={fw}>{fw}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="database_type">Veritabanı</label>
          <select
            id="database_type"
            name="database_type"
            value={formData.database_type}
            onChange={handleInputChange}
          >
            <option value="">Seçiniz...</option>
            {projectOptions.backend_options?.databases?.map(db => (
              <option key={db} value={db}>{db}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="auth_method">Kimlik Doğrulama</label>
          <select
            id="auth_method"
            name="auth_method"
            value={formData.auth_method}
            onChange={handleInputChange}
          >
            <option value="">Seçiniz...</option>
            {projectOptions.backend_options?.auth_methods?.map(auth => (
              <option key={auth} value={auth}>{auth}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="api_style">API Stili</label>
          <select
            id="api_style"
            name="api_style"
            value={formData.api_style}
            onChange={handleInputChange}
          >
            <option value="">Seçiniz...</option>
            {projectOptions.backend_options?.api_styles?.map(style => (
              <option key={style} value={style}>{style}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="orm_tool">ORM/Database Tool</label>
          <select
            id="orm_tool"
            name="orm_tool"
            value={formData.orm_tool}
            onChange={handleInputChange}
          >
            <option value="">Seçiniz...</option>
            {projectOptions.backend_options?.orm_tools?.map(orm => (
              <option key={orm} value={orm}>{orm}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );

  return (
    <form className="project-form" onSubmit={handleSubmit}>
      <h2>📋 Proje Bilgilerini Girin</h2>
      
      {/* Genel Bilgiler */}
      <div className="form-section">
        <h3>🔧 Genel Bilgiler</h3>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="project_category">Proje Kategorisi *</label>
            <select
              id="project_category"
              name="project_category"
              value={formData.project_category}
              onChange={handleInputChange}
              required
            >
              <option value="">Seçiniz...</option>
              {projectOptions.categories?.map(category => (
                <option key={category} value={category}>
                  {category === 'frontend' ? '🎨 Frontend' : 
                   category === 'backend' ? '⚙️ Backend' : 
                   '🔄 Full Stack'}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="project_type">Proje Türü *</label>
            <select
              id="project_type"
              name="project_type"
              value={formData.project_type}
              onChange={handleInputChange}
              required
            >
              <option value="">Seçiniz...</option>
              {projectOptions.common_options?.project_types?.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Kategori-özel alanlar */}
      {formData.project_category === 'frontend' && renderFrontendFields()}
      {formData.project_category === 'backend' && renderBackendFields()}
      {formData.project_category === 'fullstack' && (
        <>
          {renderFrontendFields()}
          {renderBackendFields()}
        </>
      )}

      {/* Ortak Alanlar */}
      <div className="form-section">
        <h3>⚡ Ortak Ayarlar</h3>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="deployment_platform">Deployment Platform</label>
            <select
              id="deployment_platform"
              name="deployment_platform"
              value={formData.deployment_platform}
              onChange={handleInputChange}
            >
              <option value="">Seçiniz...</option>
              {projectOptions.common_options?.deployment_platforms?.map(platform => (
                <option key={platform} value={platform}>{platform}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="code_style">Kod Stili</label>
            <select
              id="code_style"
              name="code_style"
              value={formData.code_style}
              onChange={handleInputChange}
            >
              <option value="">Seçiniz...</option>
              {projectOptions.common_options?.code_styles?.map(style => (
                <option key={style} value={style}>{style}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <div className="checkbox-group">
              <input
                type="checkbox"
                id="testing_requirement"
                name="testing_requirement"
                checked={formData.testing_requirement}
                onChange={handleInputChange}
              />
              <label htmlFor="testing_requirement">Test gereksinimleri dahil et</label>
            </div>
          </div>
        </div>
      </div>

      {/* Ek Gereksinimler */}
      <div className="form-section">
        <div className="form-group">
          <label>Ek Gereksinimler</label>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <input
              type="text"
              value={additionalRequirement}
              onChange={(e) => setAdditionalRequirement(e.target.value)}
              placeholder="Ek gereksinim ekleyin..."
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddRequirement())}
            />
            <button type="button" onClick={handleAddRequirement} className="action-btn">
              Ekle
            </button>
          </div>
          {formData.additional_requirements.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {formData.additional_requirements.map((req, index) => (
                <span 
                  key={index} 
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '12px',
                    fontSize: '0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}
                >
                  {req}
                  <button
                    type="button"
                    onClick={() => handleRemoveRequirement(index)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '1.2rem',
                      lineHeight: 1
                    }}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="notes">Notlar</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            rows="4"
            placeholder="Projeniz hakkında ek bilgiler..."
          />
        </div>
      </div>

      <button type="submit" className="submit-btn">
        🚀 Ruleset Oluştur
      </button>
    </form>
  );
};

export default ProjectForm;
