import { Container, Row, Col, Table, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useState, useEffect, useContext, useRef } from "react";
import _ from "lodash"
import {FaktureContext} from "../App";


function FakturaComponent(){
  const fakture = useRef([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [paginated, setPaginated] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const {dodateFakture, setDodateFakture} = useContext(FaktureContext)

  const pagination = pageNo => {
    setCurrentPage(pageNo);

    const startIndex = (pageNo - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    let paginatedStavke;

    if (search) {
      paginatedStavke = getFiltered(fakture.current, search).slice(startIndex, endIndex);
    } else {
      paginatedStavke = fakture.current.slice(startIndex, endIndex);
    }

    setPaginated(paginatedStavke);
    };

  useEffect(() => {
    const headers = {
      "Content-Type": "application/json"
    };
    const getFakture = () => {
      axios
        .get("http://localhost:8000/api/fakture/", {
          headers: headers
        })
        .then(response => {
          fakture.current = response.data;
          pagination(1);
        })
        .catch(error => {
          console.log(error);
          setError(error);
        })
        .finally(() => {
          setLoading(false);
        });
    };
    getFakture();
  }, []);

  useEffect(() => {
    pagination(1);
  }, [search]);


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

  const handleSearch = event => {
    setSearch(event.target.value);
  };

  const getFiltered = (fakture, search) => {
    return fakture.filter(product =>
      product.broj_fakture.toString().toLowerCase().includes(search) ||
      product.iznos_za_placanje.toString().toLowerCase().includes(search) ||
      product.uplaceno.toString().toLowerCase().includes(search)
    );
  };



  const pageSize = 3;
  const pageCount = paginated
    ? Math.ceil(fakture.current.length / pageSize)
    : 0;
  if(pageCount === 0) return null; 
  const pages = _.range(1,pageCount + 1)

  return (
    <Container className="containerr">
      <Row style={{marginTop:20, marginBottom:25}}><Col id="stavke-naslov"><h2>Izlazne Fakture</h2></Col></Row>
      <Row style={{ marginTop: 50, marginBottom: 25 }}>
        <Col id="stavke-search">
          <label htmlFor="search">
            <input placeholder="Search" id="search" type="text" onChange={handleSearch} />
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
          <nav className="d-flex justify-content-center">
                <ul className="pagination">
                  {
                    pages.map((page) => (
                      <li className={
                        page === currentPage? "page-item active":"page-item"
                      }><p className="page-link"
                      onClick={()=>pagination(page)}>{page}</p></li>
                    ))
                  }
                </ul>
              </nav>
        </Col>
      </Row>
    </Container>
  )
}



export default FakturaComponent;