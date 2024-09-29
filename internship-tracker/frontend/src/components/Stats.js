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
        <Row>
            <Col></Col>
            <Col xs="5">
              <div className="stat-column">
                <h3 className="stat-name"style={{ }}>Total Applications :</h3>
              </div>
            </Col>
            <Col xs="2">
              <div className="stat-column">
                <p className="stat-value">{stats.applications}</p>
              </div>
            </Col>
            <Col></Col>
          </Row>
          <Row>
            <Col>
              <Row className="stat-row">
                <Col xs="8">
                  <div className="stat-column">
                    <h3 className="stat-name-tablet">Online Assessments</h3>
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
                    <h3 className="stat-name-tablet">Total Interviews</h3>
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
                    <h3 className="stat-name-tablet">Offers Received</h3>
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
            </Col>

            <Col>
              <Row className="stat-row">
                <Col xs="8">
                  <div className="stat-column">
                    <h3 className="stat-name-tablet">Rejected</h3>
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
                    <h3 className="stat-name-tablet">Current Interviews</h3>
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
                    <h3 className="stat-name-tablet">Active OAs</h3>
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
            </Col>
          </Row>
          </MediaQuery>


        <MediaQuery minWidth={768} maxWidth={1023}> {/* Render only on tablet */}
          <Row>
            <Col></Col>
            <Col xs="5">
              <div className="stat-column">
                <h3 className="stat-name"style={{ }}>Total Applications :</h3>
              </div>
            </Col>
            <Col xs="2">
              <div className="stat-column">
                <p className="stat-value">{stats.applications}</p>
              </div>
            </Col>
            <Col></Col>
          </Row>
          <Row>
            <Col>
              <Row className="stat-row">
                <Col xs="8">
                  <div className="stat-column">
                    <h3 className="stat-name-tablet">Online Assessments</h3>
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
                    <h3 className="stat-name-tablet">Total Interviews</h3>
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
                    <h3 className="stat-name-tablet">Offers Received</h3>
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
            </Col>

            <Col>
              <Row className="stat-row">
                <Col xs="8">
                  <div className="stat-column">
                    <h3 className="stat-name-tablet">Rejected</h3>
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
                    <h3 className="stat-name-tablet">Current Interviews</h3>
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
                    <h3 className="stat-name-tablet">Active OAs</h3>
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
            </Col>
          </Row>
        </MediaQuery>



        <MediaQuery maxWidth={767}> {/* Render only on mobile */}
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
