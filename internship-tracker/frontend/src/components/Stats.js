import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import './Stats.css';

const Stats = ({ stat }) => {
    const [stats, setStats] = useState({
        onlineassessments: 0,
        interviews: 0,
        applications: 0,
        offersreceived: 0,
        rejected: 0,
    });
    useEffect(() => {
      setStats(stat);
  }, [stat]);

    return (
      <div>
        <Row className="stat-row">
          <Col>
            <div className="stat-column">
              <h3 className="stat-name">Online Assessments</h3>
            </div>
          </Col>
          <Col>
            <div className="stat-column">
              <h3 className="stat-name">Total Interviews</h3>
            </div>
          </Col>
          <Col>
            <div className="stat-column">
              <h3 className="stat-name">Total Applications</h3>
            </div>
          </Col>
          <Col>
            <div className="stat-column">
              <h3 className="stat-name">Offers Received</h3>
            </div>
          </Col>
          <Col>
            <div className="stat-column">
              <h3 className="stat-name">Total Rejections</h3>
            </div>
          </Col>
          <Col>
            <div className="stat-column">
              <h3 className="stat-name">Active Assessments</h3>
            </div>
          </Col>
          <Col>
            <div className="stat-column">
              <h3 className="stat-name">Current Interviews</h3>
            </div>
          </Col>
        </Row>
        <Row className="stat-row">
          <Col>
            <div className="stat-column">
              <p className="stat-value">{stats.onlineassessments}</p>
            </div>
          </Col>
          <Col>
            <div className="stat-column">
              <p className="stat-value">{stats.interviews}</p>
            </div>
          </Col>
          <Col>
            <div className="stat-column">
              <p className="stat-value">{stats.applications}</p>
            </div>
          </Col>
          <Col>
            <div className="stat-column">
              <p className="stat-value">{stats.offersreceived}</p>
            </div>
          </Col>
          <Col>
            <div className="stat-column">
              <p className="stat-value">{stats.rejected}</p>
            </div>
          </Col>
          <Col>
            <div className="stat-column">
              <p className="stat-value">{stats.currentOAs}</p>
            </div>
          </Col>
          <Col>
            <div className="stat-column">
              <p className="stat-value">{stats.currentInterviews}</p>
            </div>
          </Col>
        </Row>
      </div>
    );
};

export default Stats;
