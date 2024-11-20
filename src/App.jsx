import React, { useState, useEffect } from "react";
import { Routes, Route, Outlet, Link } from "react-router-dom";
import {
  Row,
  Col,
  Form,
  Button,
  Container,
  Tab,
  Nav,
  Image,
} from "react-bootstrap";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import 'bootstrap-icons/font/bootstrap-icons.css';
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

function generateHeartbeatData(numPoints = 100, interval = 50) {
  const data = [];
  let y = 60; // Base heart rate

  for (let i = 0; i < numPoints; i++) {
    if (i % interval === 0) {
      // Spike to simulate heartbeat
      y = Math.random() * 50 + 40;
    } else if (i % interval === interval / 2) {
      // Drop after spike
      y = Math.random() * 70 + 30;
    } else if (i % interval === interval / 2) {
      // Drop after spike
      y = Math.random() * 700 + 40;
    } else {
      // Base heart rate
      y = 60 + Math.random() * 5;
    }
    data.push({ x: i, y });
  }

  return data;
}

export default function App() {
  console.log(location);
  return (
    <Container fluid>
      <Routes>
        <Route path="*" element={<Home />} />
      </Routes>
    </Container>
  );
}

const HeartbeatChart = () => {
  const heartbeatData = generateHeartbeatData();

  const data = {
    datasets: [
      {
        label: "Heartbeat",
        data: heartbeatData,
        borderColor: "red",
        borderWidth: 1,
        pointRadius: 0,
        fill: false,
        tension: 0.2, // smooth out the curve
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        type: "linear",
        title: {
          display: true,
          text: "Time",
        },
      },
      y: {
        title: {
          display: true,
          text: "Heart Rate (BPM)",
        },
        min: 50,
        max: 120,
      },
    },
  };

  return <Line data={data} options={options} />;
};

function Home() {
  const [name, setName] = useState("");
  const [idnp, setIdnp] = useState(undefined);
  const memory = JSON.parse(localStorage.getItem("memory"));
  const [clientsList, setClientsList] = useState(memory ? memory : []);
  const insertNewClient = () => {
    if (name && idnp && idnp.length > 4) {
      setClientsList([{ name, idnp }, ...clientsList]);
      setName("")
      setIdnp("")
    }
  };

  useEffect(() => {
    console.log("clientsList: ", clientsList);
    localStorage.setItem("memory", JSON.stringify(clientsList));
  }, [clientsList]);

  return (
    <>
      <Row className="pt-3 pb-3 bg-blue">
        <Col>
          <Form.Control
            onChange={(event) => {
              setName(event.target.value);
            }}
            type="text"
            placeholder="Nume/Prenume"
          />
        </Col>
        <Col>
          <Form.Control
            onChange={(event) => {
              setIdnp(event.target.value);
            }}
            type="text"
            placeholder="IDNP"
          />
        </Col>
        <Col>
          <div className="d-grid">
            <Button
              onClick={insertNewClient}
              className="d-block"
              variant="primary"
            >
              Save
            </Button>
          </div>
        </Col>
      </Row>

      <div className="mt-4">
        {!!clientsList.length && (
          <Tab.Container
            className="mt-5"
            defaultActiveKey={clientsList[0].name + ": " + clientsList[0].idnp}
          >
            <Row>
              <Col sm={3}>
                <Nav variant="pills" className="flex-column">
                  {clientsList.map((client) => (
                    <Nav.Item>
                      <Nav.Link eventKey={client.name + ": " + client.idnp}>
                        {client.name + ": " + client.idnp} 
                      </Nav.Link>
                    </Nav.Item>
                  ))}
                </Nav>
              </Col>
              <Col sm={9}>
                <Tab.Content>
                  {clientsList.map((client) => (
                    <Tab.Pane eventKey={client.name + ": " + client.idnp}>
                      <Button type="button" class="btn btn-danger"><i class="bi bi-trash-fill"></i></Button>
                      <HeartbeatChart />
                    </Tab.Pane>
                  ))}
                </Tab.Content>
              </Col>
            </Row>
          </Tab.Container>
        )}
      </div>
    </>
  );
}
