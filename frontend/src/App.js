import "./App.css";
import { Container, Row, Col, Table, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect, createContext } from "react";
import StavkaComponent from "./components/StavkaComponent";
import FakturaComponent from "./components/FakturaComponent";
import ZatvaranjeFaktura from "./components/ZatvaranjeFaktura";



export const StavkeContext = createContext([]);
export const FaktureContext = createContext([]);

function App() {

  const [dodateStavke, setDodate] = useState({});
  const [dodateFakture, setDodateFakture] = useState({});

  const [selectedFile, setSelectedFile] = useState();
	const [isFilePicked, setIsFilePicked] = useState(false);

  const changeHandler = (event) => {
		setSelectedFile(event.target.files[0]);
		setIsFilePicked(true);
	};

	const handleSubmission = () => {
		const formData = new FormData();

		formData.append('File', selectedFile);

		fetch(
			'http://localhost:8000/api/import/',
			{
				method: 'POST',
				body: formData,
			}
		)
			.then((response) => response.json())
			.then((result) => {
				console.log('Success:', result);
			})
			.catch((error) => {
				console.error('Error:', error);
			});
	};
  
  console.log(JSON.stringify(dodateStavke) + "DODATE Stavke")
  console.log(JSON.stringify(dodateFakture) + "DODATE Stavke")

  return (
    <Container>

      <StavkeContext.Provider
        value={{ dodateStavke, setDodate }}
      >
        <StavkaComponent/>
      </StavkeContext.Provider>



      <FaktureContext.Provider
        value={{ dodateFakture, setDodateFakture }}
      >
        <FakturaComponent />
      </FaktureContext.Provider>



      <StavkeContext.Provider
        value={{ dodateStavke, setDodate }}
      >
        <FaktureContext.Provider
          value={{ dodateFakture, setDodateFakture }}
      >
          <ZatvaranjeFaktura />
        </FaktureContext.Provider>
      </StavkeContext.Provider>



      
      <Row>
        <input type="file" name="file" onChange={changeHandler} />
        <div>
          <Button variant="outline-success" onClick={handleSubmission}>Upload</Button>
          {/* <button onClick={handleSubmission}>Submit</button> */}
        </div>

      </Row>


    </Container>
  );
}

export default App;
