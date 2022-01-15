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
import { useState, useEffect, useContext } from "react";
import _ from "lodash";
import { StavkeContext, FaktureContext } from "../App";

function ZatvaranjeFaktura() {
  const [zakljucene, setZakljucene] = useState([])
  const { dodateStavke, setDodate } = useContext(StavkeContext);
  const { dodateFakture, setDodateFakture } = useContext(FaktureContext);
  const [paginated, setPaginated] = useState([])
  const [currentPage, setCurrentPage] = useState(1)

  let zakljuceneFakture = []
  Object.values(zakljucene).forEach((faktura) => {
    zakljuceneFakture = [...zakljuceneFakture, faktura]
  });



  useEffect(() => {
    const headers = {
      'Content-Type': 'application/json'
    }
    const getZakljucene = async() =>{
       await axios.get("http://localhost:8000/api/zakljucene/", {
        headers: headers
      })
        .then(response => {
          setZakljucene(response.data)
          console.log(zakljucene + "OVO JE RESPONSE")
          setPaginated(_(response.data).slice(0).take(pageSize).value())
        })

      };
    getZakljucene()
  }, [])
  console.log(zakljuceneFakture)

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

  const pageSize = 3;
  const pageCount = zakljucene? Math.ceil(zakljucene.length/pageSize):0;
  if(pageCount === 0) return null; 
  const pages = _.range(1,pageCount + 1)

  const pagination = (pageNo) => {
    setCurrentPage(pageNo);
    const startIndex = (pageNo - 1)*pageSize
    const paginatedStavke = _(zakljucene).slice(startIndex).take(pageSize).value();
    setPaginated(paginatedStavke)
  }

  return (

    <Container>
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
                    <td>{zakljucena.faktura.uplaceno}</td>
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
