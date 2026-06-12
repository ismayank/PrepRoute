export const API_BASE_URL = 'https://admin-moderator-backend-staging.up.railway.app/api';

export const ROUTES = {
  LOGIN: '/',
  DASHBOARD: '/dashboard',
  CREATE_TEST: '/tests/new',
  ADD_QUESTIONS: '/tests/:id/questions',
  PREVIEW_PUBLISH: '/tests/:id/preview',
} as const;

export const TEST_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
} as const;
