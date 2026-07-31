// frontend/src/api/progressApi.js

import appApi from './appApi';

// GET /results - most recent assessment. Backend returns 404 if the
// user hasn't taken one yet - that's a normal, expected state here,
// not a real error, so callers should handle it as "no result yet."
export const getLatestResult = async () => {
  const response = await appApi.get('/results');
  return response.data;
};

// GET /progress - full history, trend, statistics, and category_trends.
// Always returns 200, even with zero assessments (history: [], stats
// all null/0) - no need to special-case a 404 here like getLatestResult.
export const getProgress = async () => {
  const response = await appApi.get('/progress');
  return response.data;
};

// GET /recommendations - resources targeted at the categories the user
// scored worst on in their latest assessment. Same 404-on-no-assessments
// behavior as getLatestResult - callers should handle that as "no
// recommendations yet" rather than a real error.
export const getRecommendations = async () => {
  const response = await appApi.get('/recommendations');
  return response.data;
};