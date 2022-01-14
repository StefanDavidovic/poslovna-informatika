import { Container, Row, Col, Table, Button, Pagination } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useState, useEffect, useContext } from "react";
import _ from "lodash"

import {StavkeContext, FaktureContext} from "../App";

function ZatvaranjeFaktura() {

  const {dodateStavke, setDodate} = useContext(StavkeContext)
  const {dodateFakture, setDodateFakture} = useContext(FaktureContext)
  const sveStavke = JSON.stringify(dodateStavke)
  const stavkice = JSON.parse(sveStavke)
  const b = Object.keys(stavkice)
  const a = Object.values(stavkice)

  const prikaziStavke = (obj) => {
    let duzina = 0;
    Object.keys(obj).forEach(key => {
      duzina = duzina + 1;
      
      console.log(`key: ${key}, value: ${obj[key]['broj_stavke']}`)
    })
    console.log(duzina)
  }
  prikaziStavke(stavkice)
  return (
<Container>
        <Row style={{marginTop:50, marginBottom:25}}><Col id="stavke-naslov"><h2>Zatvaranje Faktura</h2></Col></Row>
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
                    <th>Poziv na broj Duznika</th>
                    <th>Model</th>
                  </tr>
                </thead>
                <tbody>
                {/* {paginated.map(stavka =>
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
                )} */}
                </tbody>
              </Table>
              {/* <nav className="d-flex justify-content-center">
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
              </nav> */}
            </Col>
          </Row>

      </Container>
  )
}

export default ZatvaranjeFaktura
