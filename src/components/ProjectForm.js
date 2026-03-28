import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config/api';
import SelectField from './SelectField';

const FALLBACK_OPTIONS = {
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
};

// Performance Optimization: Cache the API response to prevent redundant network requests
// when switching between Single and Multi-Agent modes which remounts the component.
let optionsCachePromise = null;

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
    // Load available options from API or cache
    const loadOptions = async () => {
      if (!optionsCachePromise) {
        optionsCachePromise = axios.get(`${API_BASE_URL}/project-categories`)
          .then(response => response.data)
          .catch(error => {
            console.error('Error loading options:', error);
            return FALLBACK_OPTIONS;
          });
      }

      const data = await optionsCachePromise;
      setProjectOptions(data);
    };

    loadOptions();
  }, []);

  // Performance Optimization: Use useCallback to maintain stable reference
  // so that SelectField components do not re-render unnecessarily.
  // Performance Optimization: Memoize the mapped options to prevent breaking React.memo
  // on the SelectField component. If passed directly in JSX, it creates a new array on every render.
  const categoryOptions = useMemo(() => {
    return projectOptions.categories?.map(category => (
      <option key={category} value={category}>
        {category === 'frontend' ? '🎨 Frontend' :
         category === 'backend' ? '⚙️ Backend' :
         '🔄 Full Stack'}
      </option>
    ));
  }, [projectOptions.categories]);

  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  }, []);

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
        <SelectField
          id="frontend_framework"
          name="frontend_framework"
          label="Frontend Framework"
          value={formData.frontend_framework}
          onChange={handleInputChange}
          required={true}
          options={projectOptions.frontend_options?.frameworks}
        />

        <SelectField
          id="styling_approach"
          name="styling_approach"
          label="Stil Yaklaşımı"
          value={formData.styling_approach}
          onChange={handleInputChange}
          options={projectOptions.frontend_options?.styling_approaches}
        />

        <SelectField
          id="state_management"
          name="state_management"
          label="State Management"
          value={formData.state_management}
          onChange={handleInputChange}
          options={projectOptions.frontend_options?.state_management}
        />

        <SelectField
          id="http_client"
          name="http_client"
          label="HTTP Client"
          value={formData.http_client}
          onChange={handleInputChange}
          options={projectOptions.frontend_options?.http_clients}
        />

        <SelectField
          id="ui_library"
          name="ui_library"
          label="UI Kütüphanesi"
          value={formData.ui_library}
          onChange={handleInputChange}
          options={projectOptions.frontend_options?.ui_libraries}
        />

        <SelectField
          id="build_tool"
          name="build_tool"
          label="Build Tool"
          value={formData.build_tool}
          onChange={handleInputChange}
          options={projectOptions.frontend_options?.build_tools}
        />

        <SelectField
          id="testing_framework"
          name="testing_framework"
          label="Test Framework"
          value={formData.testing_framework}
          onChange={handleInputChange}
          options={projectOptions.frontend_options?.testing_frameworks}
        />
      </div>
    </div>
  );

  const renderBackendFields = () => (
    <div className="category-fields">
      <h3>⚙️ Backend Ayarları</h3>
      
      <div className="form-grid">
        <SelectField
          id="backend_language"
          name="backend_language"
          label="Backend Dili"
          value={formData.backend_language}
          onChange={handleInputChange}
          required={true}
          options={projectOptions.backend_options?.languages}
        />

        <SelectField
          id="backend_framework"
          name="backend_framework"
          label="Backend Framework"
          value={formData.backend_framework}
          onChange={handleInputChange}
          options={projectOptions.backend_options?.frameworks}
        />

        <SelectField
          id="database_type"
          name="database_type"
          label="Veritabanı"
          value={formData.database_type}
          onChange={handleInputChange}
          options={projectOptions.backend_options?.databases}
        />

        <SelectField
          id="auth_method"
          name="auth_method"
          label="Kimlik Doğrulama"
          value={formData.auth_method}
          onChange={handleInputChange}
          options={projectOptions.backend_options?.auth_methods}
        />

        <SelectField
          id="api_style"
          name="api_style"
          label="API Stili"
          value={formData.api_style}
          onChange={handleInputChange}
          options={projectOptions.backend_options?.api_styles}
        />

        <SelectField
          id="orm_tool"
          name="orm_tool"
          label="ORM/Database Tool"
          value={formData.orm_tool}
          onChange={handleInputChange}
          options={projectOptions.backend_options?.orm_tools}
        />
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
          <SelectField
            id="project_category"
            name="project_category"
            label="Proje Kategorisi"
            value={formData.project_category}
            onChange={handleInputChange}
            required={true}
          >
            {categoryOptions}
          </SelectField>

          <SelectField
            id="project_type"
            name="project_type"
            label="Proje Türü"
            value={formData.project_type}
            onChange={handleInputChange}
            required={true}
            options={projectOptions.common_options?.project_types}
          />
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
          <SelectField
            id="deployment_platform"
            name="deployment_platform"
            label="Deployment Platform"
            value={formData.deployment_platform}
            onChange={handleInputChange}
            options={projectOptions.common_options?.deployment_platforms}
          />

          <SelectField
            id="code_style"
            name="code_style"
            label="Kod Stili"
            value={formData.code_style}
            onChange={handleInputChange}
            options={projectOptions.common_options?.code_styles}
          />

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
