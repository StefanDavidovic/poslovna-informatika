import { Container, Row, Col, Table, Button, Pagination } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useState, useEffect, useContext } from "react";
import _ from "lodash"

import {StavkeContext} from "../App";


function StavkaComponent(){
  
  const [stavke, setStavke] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paginated, setPaginated] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const {dodateStavke, setDodate} = useContext(StavkeContext)


  useEffect(() => {
    const headers = {
      'Content-Type': 'application/json'
    }
    const getStavke = async() =>{
       await axios.get("http://localhost:8000/api/stavke/", {
        headers: headers
      })
        .then(response => {
          setStavke(response.data)
          setPaginated(_(response.data).slice(0).take(pageSize).value())
        })
        .catch(error => {
          console.log(error)
          setError(error)
        })
        .finally(() => {
          setLoading(false)
        })

      };
    getStavke()
  }, [])

  const getRowClassName = id => dodateStavke[id] ? "selected" : "unselected";

  const onRowClick = (faktura) => (e) => {
    console.log(dodateStavke + "dodateeee testtt")
    if (dodateStavke[faktura.id]) { 
      const newDodate = {...dodateStavke};
      delete newDodate[faktura.id];
      return setDodate(newDodate);
    }
    setDodate({...dodateStavke, [faktura.id]: faktura});
  }


  const pageSize = 3;
  const pageCount = stavke? Math.ceil(stavke.length/pageSize):0;
  if(pageCount === 0) return null; 
  const pages = _.range(1,pageCount + 1)

  const pagination = (pageNo) => {
    setCurrentPage(pageNo);
    const startIndex = (pageNo - 1)*pageSize
    const paginatedStavke = _(stavke).slice(startIndex).take(pageSize).value();
    setPaginated(paginatedStavke)
  }
  return (
    <Container>
        <Row style={{marginTop:50, marginBottom:25}}><Col id="stavke-naslov"><h2>Stavke Izvoda</h2></Col></Row>
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
                {paginated.map(stavka =>
                  <tr key={stavka.id}  className={getRowClassName(stavka.id)} onClick={onRowClick(stavka)}>
                    <td>{stavka.broj_stavke}</td>
                    <td>{stavka.iznos}</td>
                    <td>{stavka.duznik.naziv}</td>
                    <td>{stavka.svrha_placanja}</td>
                    <td>{stavka.duznik.bankarski_racun_id.broj_racuna}</td>
                    <td>{stavka.poziv_na_broj}</td>
                    <td>{stavka.model} </td>
                    <td>{stavka.iznos} </td>
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

export default  StavkaComponent;