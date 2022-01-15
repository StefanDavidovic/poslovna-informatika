import { Container, Row, Col, Table, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useState, useEffect, useContext } from "react";
import _ from "lodash"
import {FaktureContext} from "../App";


function FakturaComponent(){
  const [fakture, setFakture] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const [dodate, setDodate] = useState({});
  const [paginated, setPaginated] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const {dodateFakture, setDodateFakture} = useContext(FaktureContext)


  useEffect(() => {
    const headers = {
      'Content-Type': 'application/json'
    }
    const getFakture = async() =>{
      axios.get("http://localhost:8000/api/fakture/", {
        headers: headers
      })
        .then(response => {
          setFakture(response.data)
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
    getFakture()


  }, []);

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

  const pageSize = 3;
  const pageCount = fakture? Math.ceil(fakture.length/pageSize):0;
  if(pageCount === 0) return null; 
  const pages = _.range(1,pageCount + 1)

  const pagination = (pageNo) => {
    setCurrentPage(pageNo);
    const startIndex = (pageNo - 1)*pageSize
    const paginatedStavke = _(fakture).slice(startIndex).take(pageSize).value();
    setPaginated(paginatedStavke)
  }

  return (
    <Container>
      <Row style={{marginTop:20, marginBottom:25}}><Col id="stavke-naslov"><h2>Izlazne Fakture</h2></Col></Row>
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