import './App.css';
import axios from 'axios';
import {useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';




function App() {



  const [characters, setCharacters] = useState([])
  const [text,setText]= useState([])
  const [suggestions,setSuggestions ]= useState([])
  const [resultCharacters,setresultCharacters]=useState([])
  const [nextPage,setNextPage]=useState([])
  const [previousPage,setPreviousPage]=useState([])
  const [totalPages,setTotalPages]=useState([])

  const onChangeHandler = (text) => {
    let matches = []
      if (text.length > 0) {

        const loadCharacters = async () => {
          const response = await axios.get('https://rickandmortyapi.com/api/character/?name='+text);
          console.log(response.data.results)
          setCharacters(response.data.results)
          }
        loadCharacters()

        matches = characters.filter(character => {
        const regex = new RegExp(`${text}`, "gi");
        return character.name.match(regex)
        })
      }
      console.log(matches)
      setSuggestions(matches)
      setText(text)
    }

    const getCharacter=async (character)=> {
      let characterData=await axios.get('https://rickandmortyapi.com/api/character/'+character.id);
      console.log(characterData.data)
      setresultCharacters([characterData.data])
      setSuggestions([])
      setTotalPages(0)
      setPreviousPage(null)
      setNextPage(null)
    
    }

    const search=async (event)=>{
      if(event.charCode===13){//Controll for Enter key
        let characterData=await axios.get('https://rickandmortyapi.com/api/character/?name='+text);
        console.log(characterData.data.results)
        setNextPage(characterData.data.info.next)
        setPreviousPage(characterData.data.info.prev)
        setTotalPages(characterData.data.info.pages)
        setresultCharacters(characterData.data.results)
        setSuggestions([])
      }
    }


    const changePage= async (url)=>{
      let characterData=await axios.get(url);
        console.log(characterData.data.results)
        setNextPage(characterData.data.info.next)
        setPreviousPage(characterData.data.info.prev)
        setresultCharacters(characterData.data.results)
        setTotalPages(characterData.data.info.pages)
    }


    let prevPage=""
    let nxtPage=""
    if(totalPages && totalPages>1){
      if(previousPage !== null){
        prevPage=<li className="page-item"><a className="page-link" onClick={()=>changePage(previousPage)} href="#">Previous</a></li>
      }
  
      if(nextPage!==null){
        nxtPage=<li className="page-item"><a className="page-link" onClick={()=>changePage(nextPage)} href="#">Next</a></li>
      }
  
    }

  return (
    <div className="container card" style={{paddingBottom:"1%"}}>
      <h1>Characters of <i><b>Rick & Morty</b></i></h1>
      <input type="text" className="form-control col-md-12 input"
      onChange={e => onChangeHandler(e.target.value)} placeholder="Enter the character name to search"
      value={text} onKeyPress={search}
      />
      {suggestions && suggestions.map((suggestion, i) =>
        <div className="suggestion col-md-12 justify-content-md-center" onClick={()=>getCharacter(suggestion)}>{suggestion.name}</div>
      )}
      {resultCharacters.length > 0 ? 
        <div>
          <table className="table table-primary table-bordered">
            <thead>
              <th>Name</th>
              <th>Location</th>
              <th>Species</th>
              <th>Type</th>
              <th>Dead/Alive</th>
              <th>Image</th>        
            </thead>
            <tbody>
            {resultCharacters && resultCharacters.map((character,i)=>
              <tr>
                <td>{character.name}</td>
                <td>{character.location.name}</td>
                <td>{character.species}</td>
                <td>{character.type}</td>
                <td>{character.status}</td>
                <td><img src={character.image} style={{width:'100px',height:'100px'}}></img></td>
              </tr>
              )}
            </tbody>
          </table>
          <nav aria-label="Page navigation example">
                <ul className="pagination">
                  {prevPage}
                  {nxtPage}              
                </ul>
          </nav>
        </div> : ""
      }
    </div>
  );
}

export default App;
