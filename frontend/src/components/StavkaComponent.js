import {
  Container,
  Row,
  Col,
  Table,
  Button
} from "react-bootstrap";
import Pagination from "@material-ui/lab/Pagination";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useState, useRef, useEffect, useContext } from "react";
import _ from "lodash";

import { StavkeContext } from "../App";

function StavkaComponent() {
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [paginated, setPaginated] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const { dodateStavke, setDodate } = useContext(StavkeContext);
  const [brojStavki, setBrojStavki] = useState([])
  

  const URL = `http://localhost:8000/api/paginate-stavke?q=${search}&page=${currentPage}`;

  useEffect(() => {
    fetch(URL)
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error('something went wrong while requesting posts');
      })
      .then((paginated) => {setPaginated(paginated.data); setBrojStavki(paginated.total)})
      .catch((error) => setError(error.message));
  }, [search, currentPage]);

  const handleChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleChangeSearch = (event,value) =>{
    setSearch(event.target.value);
  }
  console.log(search)

  const getRowClassName = id => (dodateStavke[id] ? "selected" : "unselected");

  const onRowClick = faktura => e => {
    if (dodateStavke[faktura.id]) {
      const newDodate = { ...dodateStavke };
      delete newDodate[faktura.id];
      return setDodate(newDodate);
    }
    setDodate({ ...dodateStavke, [faktura.id]: faktura });
  };

  return (
    <Container  className="containerr">
      <Row style={{ marginTop: 50, marginBottom: 25 }}>
        <Col id="stavke-naslov">
          <h2>Stavke Izvoda</h2>
        </Col>
      </Row>
      <Row style={{ marginTop: 50, marginBottom: 25 }}>
        <Col id="stavke-search">
          <label htmlFor="search">
            <input placeholder="Search" id="search" type="text" onChange={handleChangeSearch}/>
          </label>
        </Col>
      </Row>
      <Row>
        <Col>
          <Table striped bordered hover responsive="md">
            <thead>
              <tr>
                <th>Broj Stavke</th>
                <th>Iznos</th>
                <th>Duznik</th>
                <th>Svrha Placanja</th>
                <th>Racun Duznika</th>
                <th>Poziv na broj</th>
                <th>Model</th>
                <th>Preostali Iznos</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map(stavka => (
                <tr
                  key={stavka.id}
                  className={getRowClassName(stavka.id)}
                  onClick={onRowClick(stavka)}
                >
                  <td>{stavka.broj_stavke}</td>
                  <td>{stavka.iznos}</td>
                  <td>{stavka.duznik.naziv}</td>
                  <td>{stavka.svrha_placanja}</td>
                  <td>{stavka.duznik.bankarski_racun_id.broj_racuna}</td>
                  <td>{stavka.poziv_na_broj}</td>
                  <td>{stavka.model} </td>
                  <td>{stavka.preostalo} </td>
                </tr>
              ))}
            </tbody>
            
          </Table>
          <Pagination id='paginacija' count={Math.ceil(brojStavki/3)} page={currentPage} onChange={handleChange} />
        </Col>
      </Row>
    </Container>
  );
}

export default StavkaComponent;