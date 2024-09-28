import React, { useState, useEffect } from 'react';
import { Row, Col, ListGroup } from 'react-bootstrap';
import styled from 'styled-components';
import MediaQuery from 'react-responsive';
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
        <MediaQuery minWidth={1024}> {/* Render only on desktop */}
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
                <h3 className="stat-name">Rejected</h3>
              </div>
            </Col>
            <Col>
              <div className="stat-column">
                <h3 className="stat-name">Active OAs</h3>
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
          </MediaQuery>
        <MediaQuery maxWidth={600}> {/* Render only on mobile */}
        <Row className="stat-row">
          <Col xs="8">
            <div className="stat-column">
              <h3 className="stat-name-phone ">Online Assessments</h3>
            </div>
          </Col>
          <Col>
            <h3 className="colon">:</h3>
          </Col>
          <Col>
            <div className="stat-column">
              <p className="stat-value">{stats.onlineassessments}</p>
            </div>
          </Col>
        </Row>
        <Row className="stat-row">
          <Col xs="8">
            <div className="stat-column">
              <h3 className="stat-name-phone ">Total Interviews</h3>
            </div>
          </Col>
          <Col>
            <h3 className="colon">:</h3>
          </Col>
          <Col>
            <div className="stat-column">
              <p className="stat-value">{stats.interviews}</p>
            </div>
          </Col>
        </Row>    
        <Row className="stat-row">
          <Col xs="8">
            <div className="stat-column">
              <h3 className="stat-name-phone ">Total Applications</h3>
            </div>
          </Col>
          <Col>
            <h3 className="colon">:</h3>
          </Col>
          <Col>
            <div className="stat-column">
              <p className="stat-value">{stats.applications}</p>
            </div>
          </Col>
        </Row> 
        <Row className="stat-row">
          <Col xs="8">
            <div className="stat-column">
              <h3 className="stat-name-phone ">Offers Received</h3>
            </div>
          </Col>
          <Col>
            <h3 className="colon">:</h3>
          </Col>
          <Col>
            <div className="stat-column">
              <p className="stat-value">{stats.offersreceived}</p>
            </div>
          </Col>
        </Row> 
        <Row className="stat-row">
          <Col xs="8">
            <div className="stat-column">
              <h3 className="stat-name-phone ">Rejected</h3>
            </div>
          </Col>
          <Col>
            <h3 className="colon">:</h3>
          </Col>
          <Col>
            <div className="stat-column">
              <p className="stat-value">{stats.rejected}</p>
            </div>
          </Col>
        </Row> 
        <Row className="stat-row">
          <Col xs="8">
            <div className="stat-column">
              <h3 className="stat-name-phone ">Current Interviews</h3>
            </div>
          </Col>
          <Col>
            <h3 className="colon">:</h3>
          </Col>
          <Col>
            <div className="stat-column">
              <p className="stat-value">{stats.currentInterviews}</p>
            </div>
          </Col>
        </Row> 
        <Row className="stat-row">
          <Col xs="8">
            <div className="stat-column">
              <h3 className="stat-name-phone ">Active OAs</h3>
            </div>
          </Col>
          <Col>
            <h3 className="colon">:</h3>
          </Col>
          <Col>
            <div className="stat-column">
              <p className="stat-value">{stats.currentOAs}</p>
            </div>
          </Col>
        </Row> 

        </MediaQuery>

      </div>
    );
};

export default Stats;
