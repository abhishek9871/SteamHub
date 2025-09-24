import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

const TVDetail = () => {
  return (
    <div className="tv-detail">
      <div className="error-content">
        <h2>TV Show Detail Page</h2>
        <p>This feature is coming soon!</p>
        <Link to="/" className="back-btn">
          <FiArrowLeft />
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default TVDetail;