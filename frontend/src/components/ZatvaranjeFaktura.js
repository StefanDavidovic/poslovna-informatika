import { Container, Row, Col, Table, Button } from "react-bootstrap";
import Pagination from "@material-ui/lab/Pagination";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect, useContext, useRef } from "react";
import { StavkeContext, FaktureContext } from "../App";

function ZatvaranjeFaktura() {
  const { dodateStavke, setDodate } = useContext(StavkeContext);
  const { dodateFakture, setDodateFakture } = useContext(FaktureContext);
  const [paginated, setPaginated] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [brojStavki, setBrojStavki] = useState([]);

  const URL = `http://localhost:8000/api/paginate-zakljucene?q=${search}&page=${currentPage}`;

  useEffect(() => {
    fetch(URL)
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error("something went wrong while requesting posts");
      })
      .then((paginated) => {
        setPaginated(paginated.data);
        setBrojStavki(paginated.total);
      })
      .catch((error) => setError(error.message));
  }, [search, currentPage]);

  const handleChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleChangeSearch = (event, value) => {
    setSearch(event.target.value);
  };

  const eventHandler = async (event) => {
    let data = {};
    let fakturaa = {};
    let stavkaa = {};

    let uplaceno = prompt("Unesite iznos:");

    Object.values(dodateFakture).forEach((faktura) => {
      data["faktura"] = faktura.id;
      fakturaa = faktura;
    });
    Object.values(dodateStavke).forEach((stavka) => {
      data["stavka"] = stavka.id;
      stavkaa = stavka;
    });
    data["uplaceno"] = parseFloat(uplaceno);
    
    if (
      parseFloat(uplaceno) + parseFloat(fakturaa["uplaceno"]) <=
        parseFloat(fakturaa["iznos_za_placanje"]) &&
      parseFloat(stavkaa["preostalo"]) - parseFloat(uplaceno) >= 0)
     {
      stavkaa["preostalo"] =
        parseFloat(stavkaa["preostalo"]) - parseFloat(uplaceno);
      fakturaa["uplaceno"] =
        parseFloat(fakturaa["uplaceno"]) + parseFloat(uplaceno);

      await fetch("http://localhost:8000/api/zakljucene/create", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .then((result) => {
          console.log(result);
        })
        .catch((err) => console.log("error"));
      window.location.reload();
    }else{
      alert("Proverite stanje uplaceno i preostalo")
    }
  };

  return (
    <Container className="containerr">
      <Row>
        <Col>
          <Button variant="outline-dark" id="btn-otkazi">
            Otkazi
          </Button>
        </Col>
        <Col>
          <Button onClick={eventHandler} variant="success">
            Poveziii
          </Button>
        </Col>
      </Row>
      <Row style={{ marginTop: 50, marginBottom: 25 }}>
        <Col id="stavke-naslov">
          <h2>Zatvorene Fakture</h2>
        </Col>
      </Row>
      <Row style={{ marginTop: 50, marginBottom: 25 }}>
        <Col id="stavke-search">
          <label htmlFor="search">
            <input
              placeholder="Search"
              id="search"
              type="text"
              onChange={handleChangeSearch}
            />
          </label>
        </Col>
      </Row>
      <Row>
        <Col>
          <Table striped bordered hover responsive="md">
            <thead>
              <tr>
                <th>Broj Fakture</th>
                <th>Broj Stavke</th>
                <th>Iznos</th>
                <th>Ime Duznika</th>
                <th>Racun Duznika</th>
                <th>Poziv na Broj</th>
                <th>Model</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((zakljucena) => (
                <tr key={zakljucena.id}>
                  <td>{zakljucena.faktura.broj_fakture}</td>
                  <td>{zakljucena.stavka.broj_stavke}</td>
                  <td>{zakljucena.uplaceno}</td>
                  <td>{zakljucena.stavka.duznik.naziv}</td>
                  <td>
                    {zakljucena.stavka.duznik.bankarski_racun_id.broj_racuna}
                  </td>
                  <td>{zakljucena.stavka.poziv_na_broj}</td>
                  <td>{zakljucena.stavka.model}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Pagination
            id="paginacija"
            count={Math.ceil(brojStavki / 3)}
            page={currentPage}
            onChange={handleChange}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default ZatvaranjeFaktura;
