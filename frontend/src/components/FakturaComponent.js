import { Container, Row, Col, Table, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect, useContext, useRef } from "react";
import Pagination from "@material-ui/lab/Pagination";
import {FaktureContext} from "../App";

function FakturaComponent(){
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [paginated, setPaginated] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const {dodateFakture, setDodateFakture} = useContext(FaktureContext)
  const [brojStavki, setBrojStavki] = useState([])

  const URL = `http://localhost:8000/api/paginate-fakture?q=${search}&page=${currentPage}`;

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

  const getRowClassName = id => dodateFakture[id] ? "selected" : "unselected";

  const onRowClick = (faktura) => (e) => {
    if (dodateFakture[faktura.id]) {
      console.log("Prvi log: ")
      const newDodate = {...dodateFakture};
      delete newDodate[faktura.id];

      return setDodateFakture(newDodate);
    }

    setDodateFakture({...dodateFakture, [faktura.id]: faktura});
  }

  return (
    <Container className="containerr">
      <Row style={{marginTop:20, marginBottom:25}}><Col id="stavke-naslov"><h2>Izlazne Fakture</h2></Col></Row>
      <Row style={{ marginTop: 50, marginBottom: 25 }}>
        <Col id="stavke-search">
          <label htmlFor="search">
            <input placeholder="Search" id="search" type="text" onChange={handleChangeSearch} />
          </label>
        </Col>
      </Row>
      <Row>
        <Col>
          <Table striped bordered hover responsive="md" id="tableFakutura">
            <thead>
              <tr>
                <th>Broj Fakture</th>
                <th>Iznos</th>
                <th>Placeni Iznos</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map(faktura =>
                <tr className={getRowClassName(faktura.id)} key={faktura.id} onClick={onRowClick(faktura)}>
                  <td>{faktura.broj_fakture}</td>
                  <td>{faktura.iznos_za_placanje}</td>
                  <td>{faktura.uplaceno}</td>
                </tr>
              )}
            </tbody>
          </Table>
          <Pagination id='paginacija' count={Math.ceil(brojStavki/3)} page={currentPage} onChange={handleChange} />
        </Col>
      </Row>
    </Container>
  )
}

export default FakturaComponent;