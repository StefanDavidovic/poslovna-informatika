// import {
//   Container,
//   Row,
//   Col,
//   Table,
//   Button,
//   Pagination,
// } from "react-bootstrap";
// import "bootstrap/dist/css/bootstrap.min.css";
// import axios from "axios";
// import { useState, useEffect, useContext } from "react";
// import _ from "lodash";

// import { StavkeContext } from "../App";

// function StavkaComponent() {
//   const [stavke, setStavke] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [search, setSearch] = useState("");
//   const [paginated, setPaginated] = useState([]);
//   const [searched, setSeacrched] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const { dodateStavke, setDodate } = useContext(StavkeContext);
//   useEffect(() => {
//     const headers = {
//       "Content-Type": "application/json",
//     };
//     const getStavke = async () => {
//       await axios
//         .get("http://localhost:8000/api/stavke/", {
//           headers: headers,
//         })
//         .then((response) => {
//           setStavke(response.data);
//           console.log(response.data);
//           setPaginated(_(response.data).slice(0).take(pageSize).value());
//         })
//         .catch((error) => {
//           console.log(error);
//           setError(error);
//         })
//         .finally(() => {
//           setLoading(false);
//         });
//     };
//     getStavke();
//   }, []);

//   const getRowClassName = (id) =>
//     dodateStavke[id] ? "selected" : "unselected";

//   const onRowClick = (faktura) => (e) => {
//     console.log(dodateStavke + "dodateeee testtt");
//     if (dodateStavke[faktura.id]) {
//       const newDodate = { ...dodateStavke };
//       delete newDodate[faktura.id];
//       return setDodate(newDodate);
//     }
//     setDodate({ ...dodateStavke, [faktura.id]: faktura });
//   };

//   const handleSearch = (event) => {
//     setSearch(event.target.value);
//   };

//   const searchedData = stavke.filter(
//     (product) =>
//       product.broj_stavke.toString().toLowerCase().indexOf(search) > -1
//   );

//   const pageSize = 3;
//   const pageCount = searchedData
//     ? Math.ceil(searchedData.length / pageSize)
//     : 0;
//   if (pageCount === 0) return null;
//   const pages = _.range(1, pageCount + 1);

//   const pagination = (pageNo) => {
//     setCurrentPage(pageNo);
//     const startIndex = (pageNo - 1) * pageSize;
//     const paginatedStavke = _(searchedData)
//       .slice(startIndex)
//       .take(pageSize)
//       .value();
//     setPaginated(paginatedStavke);
//     console.log(paginatedStavke + "paginated stavke");
//   };

//   return (
//     <Container>
//       <Row style={{ marginTop: 50, marginBottom: 25 }}>
//         <Col id="stavke-naslov">
//           <h2>Stavke Izvoda</h2>
//         </Col>
//       </Row>
//       <Row style={{ marginTop: 50, marginBottom: 25 }}>
//         <Col id="stavke-search">
//           <label htmlFor="search">
//             <input id="search" type="text" onChange={handleSearch} />
//           </label>
//         </Col>
//       </Row>
//       <Row>
//         <Col>
//           <Table striped bordered hover responsive="md" onChange={handleSearch}>
//             <thead>
//               <tr>
//                 <th>Broj Stavke</th>
//                 <th>Iznos</th>
//                 <th>Duznik</th>
//                 <th>Svrha Placanja</th>
//                 <th>Racun Duznika</th>
//                 <th>Poziv na broj</th>
//                 <th>Model</th>
//                 <th>Preostali Iznos</th>
//               </tr>
//             </thead>
//             <tbody>
//               {searchedData.map((stavka) => (
//                 <tr
//                   key={stavka.id}
//                   className={getRowClassName(stavka.id)}
//                   onClick={onRowClick(stavka)}
//                 >
//                   <td>{stavka.broj_stavke}</td>
//                   <td>{stavka.iznos}</td>
//                   <td>{stavka.duznik.naziv}</td>
//                   <td>{stavka.svrha_placanja}</td>
//                   <td>{stavka.duznik.bankarski_racun_id.broj_racuna}</td>
//                   <td>{stavka.poziv_na_broj}</td>
//                   <td>{stavka.model} </td>
//                   <td>{stavka.preostalo} </td>
//                 </tr>
//               ))}
//             </tbody>
//           </Table>
//           <nav className="d-flex justify-content-center">
//             <ul className="pagination">
//               {pages.map((page) => (
//                 <li
//                   className={
//                     page === currentPage ? "page-item active" : "page-item"
//                   }
//                 >
//                   <p className="page-link" onClick={() => pagination(page)}>
//                     {page}
//                   </p>
//                 </li>
//               ))}
//             </ul>
//           </nav>
//         </Col>
//       </Row>
//     </Container>
//   );
// }

// export default StavkaComponent;

import {
  Container,
  Row,
  Col,
  Table,
  Button,
  Pagination
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useState, useRef, useEffect, useContext } from "react";
import _ from "lodash";

import { StavkeContext } from "../App";

function StavkaComponent() {
  const stavke = useRef([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [paginated, setPaginated] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const { dodateStavke, setDodate } = useContext(StavkeContext);

  const pagination = pageNo => {
    setCurrentPage(pageNo);

    const startIndex = (pageNo - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    let paginatedStavke;

    if (search) {
      paginatedStavke = getFiltered(stavke.current, search).slice(startIndex, endIndex);
    } else {
      paginatedStavke = stavke.current.slice(startIndex, endIndex);
    }

    setPaginated(paginatedStavke);
    console.log(paginatedStavke + "paginated stavke");
  };

  useEffect(() => {
    const headers = {
      "Content-Type": "application/json"
    };
    const getStavke = () => {
      axios
        .get("http://localhost:8000/api/stavke/", {
          headers: headers
        })
        .then(response => {
          stavke.current = response.data;
          console.log("setting initial ...");
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
    getStavke();
  }, []);

  useEffect(() => {
    pagination(1);
  }, [search]);

  const getRowClassName = id => (dodateStavke[id] ? "selected" : "unselected");

  const onRowClick = faktura => e => {
    console.log(dodateStavke + "dodateeee testtt");
    if (dodateStavke[faktura.id]) {
      const newDodate = { ...dodateStavke };
      delete newDodate[faktura.id];
      return setDodate(newDodate);
    }
    setDodate({ ...dodateStavke, [faktura.id]: faktura });
  };

  const handleSearch = event => {
    setSearch(event.target.value);
  };

  const getFiltered = (stavke, search) => {
    return stavke.filter(product =>
      product.broj_stavke.toString().toLowerCase().includes(search) ||
      product.iznos.toString().toLowerCase().includes(search) ||
      product.poziv_na_broj.toString().toLowerCase().includes(search) ||
      product.primalac.toString().toLowerCase().includes(search) ||
      product.svrha_placanja.toString().toLowerCase().includes(search) ||
      product.preostalo.toString().toLowerCase().includes(search) ||
      product.duznik.naziv.toString().toLowerCase().includes(search)
    );
  };

  const pageSize = 3;
  const pageCount = paginated
    ? Math.ceil(stavke.current.length / pageSize)
    : 0;
  if (pageCount === 0) return null;
  const pages = _.range(1, pageCount + 1);

  return (
    <Container>
      <Row style={{ marginTop: 50, marginBottom: 25 }}>
        <Col id="stavke-naslov">
          <h2>Stavke Izvoda</h2>
        </Col>
      </Row>
      <Row style={{ marginTop: 50, marginBottom: 25 }}>
        <Col id="stavke-search">
          <label htmlFor="search">
            <input id="search" type="text" onChange={handleSearch} />
          </label>
        </Col>
      </Row>
      <Row>
        <Col>
          <Table striped bordered hover responsive="md" onChange={handleSearch}>
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
          <nav className="d-flex justify-content-center">
            <ul className="pagination">
              {pages.map(page => (
                <li
                  className={
                    page === currentPage ? "page-item active" : "page-item"
                  }
                >
                  <p className="page-link" onClick={() => pagination(page)}>
                    {page}
                  </p>
                </li>
              ))}
            </ul>
          </nav>
        </Col>
      </Row>
    </Container>
  );
}

export default StavkaComponent;