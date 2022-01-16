import {
  Container,
  Row,
  Col,
  Table,
  Button,
  Pagination,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useState, useEffect, useContext, useRef } from "react";
import _ from "lodash";
import { StavkeContext, FaktureContext } from "../App";

function ZatvaranjeFaktura() {
  const zakljucene = useRef([])
  const { dodateStavke, setDodate } = useContext(StavkeContext);
  const { dodateFakture, setDodateFakture } = useContext(FaktureContext);
  const [paginated, setPaginated] = useState([])
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1)

  const pagination = pageNo => {
    setCurrentPage(pageNo);

    const startIndex = (pageNo - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    let paginatedStavke;

    if (search) {
      paginatedStavke = getFiltered(zakljucene.current, search).slice(startIndex, endIndex);
    } else {
      paginatedStavke = zakljucene.current.slice(startIndex, endIndex);
    }

    setPaginated(paginatedStavke);
    };

  useEffect(() => {
    const headers = {
      'Content-Type': 'application/json'
    }
    const getZakljucene = () =>{
       axios.get("http://localhost:8000/api/zakljucene/", {
        headers: headers
      })
        .then(response => {
          zakljucene.current=response.data
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
    getZakljucene()
  }, [])

  useEffect(() => {
    pagination(1);
  }, [search]);
  // const uplaceno = prompt("Unesite iznos:");
  const eventHandler = async (event) => {
    let data = {};
    let dataa = {};
    let fakturaa = {}
    let fakturaId = null;
    let stavkaId = null;
    let stavkaa = {}
    let korektno = true
    let uplaceno = prompt("Unesite iznos:");
    Object.values(dodateFakture).forEach((faktura) => {
      fakturaId = faktura.id
      data["faktura"] = faktura.id;
      dataa["faktura_id"] = faktura;
      fakturaa = faktura
    });
    Object.values(dodateStavke).forEach((stavka) => {
      stavkaId = stavka.id
      data["stavka"] = stavka.id;
      dataa["stavka"] = stavka;
      stavkaa = stavka
    });
    data["uplaceno"] = parseFloat(uplaceno);

    

    stavkaa['preostalo']= parseFloat(stavkaa['preostalo']) - parseFloat(uplaceno)
    if(parseFloat(stavkaa['preostalo']) > 0){
      await fetch(`http://localhost:8000/api/stavke/${stavkaId}/update`, {
        method: "PUT",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(stavkaa),
      })
        .then((res) => res.json())
        .then((result) => {
          console.log(result);
        })
        .catch((err) => console.log("error"));
    }else{
      alert(`Nedovoljno sredstava - Stavka:  ${stavkaa['broj_stavke']}`)
      stavkaa['preostalo']= 0
      korektno = false
    }

    if(korektno){

      await fetch("http://localhost:8000/api/zakljucene/create", {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .then((result) => {
          console.log(result);
        })
        .catch((err) => console.log("error"));

      fakturaa['uplaceno']= parseFloat(fakturaa['uplaceno']) + parseFloat(uplaceno)
      if(parseFloat(fakturaa['uplaceno']) > parseFloat(fakturaa['iznos_za_placanje'])){
        let kusur = parseFloat(fakturaa['uplaceno']) - parseFloat(fakturaa['iznos_za_placanje'])
        alert(`Ostalo vam je ${kusur} dinara kusura`)
        fakturaa['uplaceno'] = fakturaa['iznos_za_placanje']
      }
      await fetch(`http://localhost:8000/api/fakture/${fakturaId}/update`, {
        method: "PUT",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(fakturaa),
      })
        .then((res) => res.json())
        .then((result) => {
          console.log(result);
        })
        .catch((err) => console.log("error"));

    }
    window.location.reload(false);
  };

  const handleSearch = event => {
    setSearch(event.target.value);
  };

  const getFiltered = (zakljucene, search) => {
    return zakljucene.filter(product =>
      product.faktura.broj_fakture.toString().toLowerCase().includes(search) ||
      product.stavka.broj_stavke.toString().toLowerCase().includes(search) ||
      product.stavka.duznik.naziv.toString().toLowerCase().includes(search) ||
      product.stavka.duznik.bankarski_racun_id.broj_racuna.toString().toLowerCase().includes(search) ||
      product.stavka.poziv_na_broj.toString().toLowerCase().includes(search) ||
      product.uplaceno.toString().toLowerCase().includes(search)
    );
  };

  const pageSize = 3;
  const pageCount = paginated
    ? Math.ceil(zakljucene.current.length / pageSize)
    : 0;
  if(pageCount === 0) return null; 
  const pages = _.range(1,pageCount + 1)


  return (

    <Container className="containerr">
      <Row>
        <Col>
          <Button variant="outline-dark" id="btn-otkazi">
            Otkazi
          </Button>
        </Col>
        <Col>
          <Button onClick={eventHandler} variant="success">Poveziii</Button>
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
            <input placeholder="Search" id="search" type="text" onChange={handleSearch} />
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
              {paginated.map(zakljucena =>
                  <tr key={zakljucena.id}>
                    <td>{zakljucena.faktura.broj_fakture}</td>
                    <td>{zakljucena.stavka.broj_stavke}</td>
                    <td>{zakljucena.uplaceno}</td>
                    <td>{zakljucena.stavka.duznik.naziv}</td>
                    <td>{zakljucena.stavka.duznik.bankarski_racun_id.broj_racuna}</td>
                    <td>{zakljucena.stavka.poziv_na_broj}</td>
                    <td>{zakljucena.stavka.model}</td>
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
  );
}

export default ZatvaranjeFaktura;
