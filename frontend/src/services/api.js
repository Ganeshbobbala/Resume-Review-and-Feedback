import axios from 'axios';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000').replace(/\/+$/, '');

export const analyzeResume = async (file, targetRole) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('target_role', targetRole);

  try {
    const response = await axios.post(`${API_BASE_URL}/analyze-resume`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 30000,
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.detail || error.response.data.error || 'Failed to analyze resume.');
    } else if (error.request) {
      throw new Error(`Cannot connect to backend server on ${API_BASE_URL}.`);
    } else {
      throw new Error(error.message || 'An unexpected error occurred during resume analysis.');
    }
  }
};

export const analyzeResumeText = async (resumeText, targetRole) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/analyze-text`, {
      resume_text: resumeText,
      target_role: targetRole,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 15000,
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.detail || error.response.data.error || 'Failed to analyze resume text.');
    } else if (error.request) {
      throw new Error(`Cannot connect to backend server on ${API_BASE_URL}.`);
    } else {
      throw new Error(error.message || 'An unexpected error occurred during live resume text analysis.');
    }
  }
};

export const rewriteBullet = async (bulletText, targetRole) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/rewrite-bullet`, {
      bullet: bulletText,
      target_role: targetRole,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 15000,
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.detail || error.response.data.error || 'Failed to rewrite bullet.');
    } else if (error.request) {
      throw new Error(`Cannot connect to backend server on ${API_BASE_URL}.`);
    } else {
      throw new Error(error.message || 'An unexpected error occurred while rewriting bullet.');
    }
  }
};

export const matchJobDescription = async (file, jobDescription) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('job_description', jobDescription);

  try {
    const response = await axios.post(`${API_BASE_URL}/match-job`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 30000,
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.detail || error.response.data.error || 'Failed to match job description.');
    } else if (error.request) {
      throw new Error(`Cannot connect to backend server on ${API_BASE_URL}.`);
    } else {
      throw new Error(error.message || 'An unexpected error occurred during job matching.');
    }
  }
};

export const analyzeResumeFormat = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post(`${API_BASE_URL}/analyze-format`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 30000,
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.detail || error.response.data.error || 'Failed to analyze format.');
    } else if (error.request) {
      throw new Error(`Cannot connect to backend server on ${API_BASE_URL}.`);
    } else {
      throw new Error(error.message || 'An unexpected error occurred during format analysis.');
    }
  }
};

export const getResumeHistory = async (limit = 20) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/history?limit=${limit}`, {
      timeout: 10000,
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.detail || 'Failed to fetch history.');
    } else if (error.request) {
      throw new Error(`Cannot connect to backend server on ${API_BASE_URL}.`);
    } else {
      throw new Error(error.message || 'An unexpected error occurred while fetching history.');
    }
  }
};

export const getResumeReviewDetail = async (reviewId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/history/${reviewId}`, {
      timeout: 10000,
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.detail || 'Failed to fetch review details.');
    } else if (error.request) {
      throw new Error(`Cannot connect to backend server on ${API_BASE_URL}.`);
    } else {
      throw new Error(error.message || 'An unexpected error occurred while fetching review.');
    }
  }
};

