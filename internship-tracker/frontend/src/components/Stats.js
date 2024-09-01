import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import styled from 'styled-components';
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
  const H3 = styled.h3`
    font-size: 2vmin;
  `;

    return (
      <div>
        <Row className="stat-row">
          <Col>
            <div className="stat-column">
              <H3 className="stat-name">Online Assessments</H3>
            </div>
          </Col>
          <Col>
            <div className="stat-column">
              <H3 className="stat-name">Total Interviews</H3>
            </div>
          </Col>
          <Col>
            <div className="stat-column">
              <H3 className="stat-name">Total Applications</H3>
            </div>
          </Col>
          <Col>
            <div className="stat-column">
              <H3 className="stat-name">Offers Received</H3>
            </div>
          </Col>
          <Col>
            <div className="stat-column">
              <H3 className="stat-name">Rejected</H3>
            </div>
          </Col>
          <Col>
            <div className="stat-column">
              <H3 className="stat-name">Active OAs</H3>
            </div>
          </Col>
          <Col>
            <div className="stat-column">
              <H3 className="stat-name">Current Interviews</H3>
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
