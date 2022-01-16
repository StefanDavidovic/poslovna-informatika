import React from "react";
import {
  Container,
  Navbar,
  Button
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

function Header() {
  return (
    <Navbar id="navbar" bg="dark" variant="dark">
      <Container>
        <Navbar.Brand href="#home">Likvidatura</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
            <a id="pdf" href="http://localhost:8000/api/generatePdf">PDF</a>
          </Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
