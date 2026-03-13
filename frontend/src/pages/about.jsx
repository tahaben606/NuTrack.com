import React from 'react';
import './about.css';

export default function About() {
  return (
    <div className="about-container">
      {/* Hero Section */}
      
        
        
      

      {/* Our Story */}
      <section className="section">
  <h2>Our Story</h2>
  <p>
    We are two fullstack friends studying at ISTA, passionate about building
    meaningful projects together. Recipe Creator is our way to share that passion
    and empower others to enjoy cooking.
  </p>
</section>

      {/* Stats Section */}
      <section className="section">
        <h2>Our Impact</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon" aria-hidden="true">
              {/* Users icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.5"
                style={{ width: '24px', height: '24px' }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87M7 10a4 4 0 11-8 0 4 4 0 018 0zm13 0a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
            <div className="stat-number">250K+</div>
            <div className="stat-label">Happy Users</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" aria-hidden="true">
              {/* Recipes icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.5"
                style={{ width: '24px', height: '24px' }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 7h8M8 11h8M8 15h5"
                />
              </svg>
            </div>
            <div className="stat-number">20K+</div>
            <div className="stat-label">Recipes Shared</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" aria-hidden="true">
              {/* Countries icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.5"
                style={{ width: '24px', height: '24px' }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 21l9-5-9-5-9 5 9 5z"
                />
              </svg>
            </div>
            <div className="stat-number">50+</div>
            <div className="stat-label">Countries Reached</div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section">
        <h2>Key Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-header">
              <div className="feature-icon" aria-hidden="true">
                {/* Search icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  style={{ width: '28px', height: '28px' }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-4.35-4.35m0 0a7.5 7.5 0 10-10.6-10.6 7.5 7.5 0 0010.6 10.6z"
                  />
                </svg>
              </div>
              <h3 className="feature-title">Advanced Search</h3>
            </div>
            <p>
              Quickly find recipes by ingredients, dietary preferences, or
              cooking time.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-header">
              <div className="feature-icon" aria-hidden="true">
                {/* Sharing icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  style={{ width: '28px', height: '28px' }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 12v.01M12 4v.01M20 12v.01M12 20v.01M16 8l-4 4-4-4"
                  />
                </svg>
              </div>
              <h3 className="feature-title">Community Sharing</h3>
            </div>
            <p>
              Share your favorite recipes and discover dishes from around the
              world.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-header">
              <div className="feature-icon" aria-hidden="true">
                {/* Video icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  style={{ width: '28px', height: '28px' }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 10.5l-6 3.75 6 3.75v-7.5zM19.5 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-11.25A2.25 2.25 0 014.5 17.25v-10.5A2.25 2.25 0 016.75 4.5h11.25a2.25 2.25 0 012.25 2.25z"
                  />
                </svg>
              </div>
              <h3 className="feature-title">Video Tutorials</h3>
            </div>
            <p>
              Step-by-step cooking videos to help you master any recipe.
            </p>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section">
  <h2>Meet Our Team</h2>
  <div className="team-grid">
    <div className="team-member">
      <div className="avatar">👨‍💻</div>
      <h3>Taha BENISSAOUIA1</h3>
      <p>Fullstack Developer & Co-founder</p>
      <p>Studying at ISTA, love building projects and exploring new tech.</p>
    </div>
    <div className="team-member">
      <div className="avatar">👨‍💻</div>
      <h3>Mehdi BENABED</h3>
      <p>Fullstack Developer & Co-founder</p>
      <p>Studying at ISTA and passionate about coding and cooking.</p>
    </div>
  </div>
</section>
      {/* Core Values */}
      <section className="section">
        <h2>Our Core Values</h2>
        <div className="values-list">
          <div className="value-card">
            <div className="value-icon" aria-hidden="true">
              {/* Integrity icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.5"
                style={{ width: '24px', height: '24px' }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div className="value-title">Integrity</div>
            <div className="value-desc">
              We uphold honesty and transparency in everything we do.
            </div>
          </div>

          <div className="value-card">
            <div className="value-icon" aria-hidden="true">
              {/* Innovation icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.5"
                style={{ width: '24px', height: '24px' }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
            <div className="value-title">Innovation</div>
            <div className="value-desc">
              Constantly improving our platform with new ideas and tech.
            </div>
          </div>

          <div className="value-card">
            <div className="value-icon" aria-hidden="true">
              {/* Community icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.5"
                style={{ width: '24px', height: '24px' }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87"
                />
              </svg>
            </div>
            <div className="value-title">Community</div>
            <div className="value-desc">
              Fostering a welcoming and supportive environment.
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <h2 className="cta-title">Ready to Cook?</h2>
        <div className="cta-buttons">
        <a className="cta-btn-primary" href="/recipe" aria-label="Explore recipes">
  Explore Recipes
</a>
          
        </div>
      </section>
    </div>
  );
}
