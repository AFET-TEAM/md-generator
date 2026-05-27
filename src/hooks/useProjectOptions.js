import { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config/api';

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

let cachePromise = null;

const useProjectOptions = () => {
  const [projectOptions, setProjectOptions] = useState({
    categories: [],
    frontend_options: {},
    backend_options: {},
    common_options: {}
  });

  useEffect(() => {
    const loadOptions = async () => {
      if (!cachePromise) {
        cachePromise = axios.get(`${API_BASE_URL}/project-categories`)
          .then(response => response.data)
          .catch(error => {
            console.error('Error loading options:', error);
            return FALLBACK_OPTIONS;
          });
      }

      const data = await cachePromise;
      setProjectOptions(data);
    };

    loadOptions();
  }, []);

  return projectOptions;
};

export default useProjectOptions;
