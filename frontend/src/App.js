import "./App.css";
import { Container, Row, Col, Table, Button, Dropdown, DropdownButton } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect, createContext, useRef } from "react";
import StavkaComponent from "./components/StavkaComponent";
import FakturaComponent from "./components/FakturaComponent";
import ZatvaranjeFaktura from "./components/ZatvaranjeFaktura";
import Header from "./components/Header";
import axios from "axios";

export const StavkeContext = createContext([]);
export const FaktureContext = createContext([]);

function App() {
  const [partneri, setPartneri] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [dodateStavke, setDodate] = useState({});
  const [dodateFakture, setDodateFakture] = useState({});

  const [selectedFile, setSelectedFile] = useState();
  const [isFilePicked, setIsFilePicked] = useState(false);

  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
    setIsFilePicked(true);
  };

  const handleSubmission = () => {
    const formData = new FormData();

    formData.append("File", selectedFile);

    fetch("http://localhost:8000/api/import/", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((result) => {
        console.log("Success:", result);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    const headers = {
      "Content-Type": "application/json",
    };
    const getFakture = () => {
      axios
        .get("http://localhost:8000/api/partneri", {
          headers: headers,
        })
        .then((response) => {
          setPartneri(response.data);
        })
        .catch((error) => {
          console.log(error);
          setError(error);
        })
        .finally(() => {
          setLoading(false);
        });
    };
    getFakture();
  }, []);

  return (
    <>
      <Header />
      <Container className="containerrr">
        <StavkeContext.Provider value={{ dodateStavke, setDodate }}>
          <StavkaComponent />
        </StavkeContext.Provider>
        <hr />

        <FaktureContext.Provider value={{ dodateFakture, setDodateFakture }}>
          <FakturaComponent />
        </FaktureContext.Provider>
        <hr />

        <StavkeContext.Provider value={{ dodateStavke, setDodate }}>
          <FaktureContext.Provider value={{ dodateFakture, setDodateFakture }}>
            <ZatvaranjeFaktura />
          </FaktureContext.Provider>
        </StavkeContext.Provider>
        <hr />

        <Row id="upload">
          <Col>
            <input type="file" name="file" onChange={changeHandler} />
            <div>
              <Button variant="outline-success" onClick={handleSubmission}>
                Upload
              </Button>
            </div>
          </Col>
          <Col style={{ float: "right" }}>
            
            <DropdownButton title="Poslovni Partneri">
              {partneri.map(partner =>
              <a id="partneri" href={`http://localhost:8000/api/generatePdf/${partner.id}`}>{partner.naziv}<br/></a>)}
              {/* // <Dropdown.Item eventKey={partner.id}></Dropdown.Item> */}
            </DropdownButton>
          </Col>
        </Row>
        <hr />
      </Container>
    </>
  );
}

export default App;
