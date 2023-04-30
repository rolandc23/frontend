import './App.css';
import logo from './assets/logo.png'
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate
} from 'react-router-dom';
import React from 'react';
import { strs } from './data/blanko';

function App() {
  function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
    return array;
  }

  const Nav = () => {
    const navigate = useNavigate();
    return (
      <header>
        <img alt="hi" src={logo} className="logo" height="50px" width="50px" margin="0"></img>
        <div className="navigation-big">
          <button onClick={() => navigate('/')}> Home </button> |
          <button onClick={() => navigate('/blanko')}>Blanko</button> |
          <button onClick={() => navigate('/slido')}>Slido</button> |
          <button onClick={() => navigate('/tetro')}>Tetro</button>
        </div>
        <div className="navigation-small">
          <button onClick={() => navigate('/')}> H </button> |
          <button onClick={() => navigate('/blanko')}> B </button> |
          <button onClick={() => navigate('/slido')}> S </button> |
          <button onClick={() => navigate('/tetro')}> T </button>
        </div>
      </header>
    )
  }

  const Slido = () => {
    const [currPos, setCurrPos] = React.useState([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    const [solved, setSolved] = React.useState(false);
    React.useEffect(() => {
      const array = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8])
      setCurrPos(array);
    }, [])

    function doSlide (num) {
      const emptyIndex = currPos.findIndex((x) => x === 0);
      if (!(num === emptyIndex + 3 // 
        || num === emptyIndex - 3
        || (num === emptyIndex + 1 && (emptyIndex + 1) % 3 !== 0)
        || (num === emptyIndex - 1 && (num + 1) % 3 !== 0)
      )) {
        return;
      }

      swap(emptyIndex, num)
      const newArray =  []
      for (let i = 0; i < 9; i++) {
        newArray.push(currPos[i]);
      }
      
      setCurrPos(newArray);
      
      if (JSON.stringify(currPos) === JSON.stringify([1, 2, 3, 4, 5, 6, 7, 8, 0])) {
        const timeoutId = setTimeout(() => {
          alert('CORRECT');
          localStorage.setItem('counter', parseInt(localStorage.getItem('counter'), 10) + 1);
        }, 200);
        return () => clearTimeout(timeoutId);
      }
    }

    function doSolve() {
      setCurrPos([1, 2, 3, 4, 5, 6, 7, 8, 0]);
      setSolved(true);
    }

    function swap (a, b) {
      const temp = currPos[a];
      currPos[a] = currPos[b]
      currPos[b] = temp;
    }

    React.useEffect(() => {
      if (JSON.stringify(currPos) === JSON.stringify([1, 2, 3, 4, 5, 6, 7, 8, 0])) {
        setSolved(true);
      } else {
        setSolved(false);
      }
    }, [currPos])

    function doKeySlide (e) {
      const emptyIndex = currPos.findIndex((x) => x === 0);
      if (e.key === "ArrowUp" && (emptyIndex + 3 < 9)) {
        const currSlide = emptyIndex + 3;
        swap(currSlide, emptyIndex);
      } else if (e.key === "ArrowDown" && (emptyIndex - 3 >= 0)) {
        const currSlide = emptyIndex - 3;
        swap(currSlide, emptyIndex);
      } else if (e.key === "ArrowLeft" && ((emptyIndex + 1) % 3 !== 0) && emptyIndex + 1 < 9) {
        const currSlide = emptyIndex + 1;
        swap(currSlide, emptyIndex);
      } else if (e.key === "ArrowRight" && ((emptyIndex) % 3 !== 0) && emptyIndex - 1 >= 0) {
        const currSlide = emptyIndex - 1;
        swap(currSlide, emptyIndex);
      }
      const newArray =  []
      for (let i = 0; i < 9; i++) {
        newArray.push(currPos[i]);
      }
      setCurrPos(newArray);
      if (JSON.stringify(currPos) === JSON.stringify([1, 2, 3, 4, 5, 6, 7, 8, 0])) {
        const timeoutId = setTimeout(() => {
          alert('CORRECT');
          localStorage.setItem('counter', parseInt(localStorage.getItem('counter'), 10) + 1);
        }, 200);
        return () => clearTimeout(timeoutId);
      }
    }

    return (
      <main>
        <div className='slidoPage'>
          <div className='slidoContainer' onKeyDown={(e) => doKeySlide(e)} tabIndex={0}>
            {currPos &&
              <>
                {currPos.map((num, index) => {
                  return (
                    <div key={`slidoquare-${index}`} className='slidoSquare'>{num !== 0 && <img alt="slidoImage" onClick={() => doSlide(index)} className='slidoImage' src={`shrek/${num}.png`}></img>}</div>
                  )
                })}
              </>
            }
          </div>
          <div className='slidoButtons'>
            <button onClick={doSolve} disabled={solved}>Solve</button>
            <button onClick={() => setCurrPos(shuffle([1, 2, 3, 4, 5, 6, 7, 8, 0]))}>Reset</button>
          </div>
        </div>
      </main>
    )
  }

  const Home = () => {
    const [gamesWon, setGamesWon] = React.useState(0);
    const handleFetchData = async () => {
      const response = await fetch('https://cgi.cse.unsw.edu.au/~cs6080/raw/data/info.json');
      const data = await response.json();
      localStorage.setItem('counter', data.score);
      setGamesWon(data.score);
    }

    React.useEffect(() => {
      const counter = localStorage.getItem('counter');
      if (counter) {
        setGamesWon(counter);
      } else {
        handleFetchData();
      }
    }, [])

    return (
      <main>
        <div className='dashboard'>
          <div className='dashboardText'>
            <li className='dashboardHeader'>Please choose an option from the navbar.</li>
            <li>Games won: {gamesWon} <button onClick={handleFetchData}>(reset)</button></li>
          </div>
        </div>
      </main>
    )
  }

  const Blanko = () => {
    const [gameStr, setGameStr] = React.useState('');
    const [solutionStr, setSolutionStr] = React.useState('')
    const [change, setChange] = React.useState(false);
    const [playerStr, setPlayerStr] = React.useState('');
    const [squareArray] = React.useState([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
    React.useEffect(() => {
      setGameStr('');
      const array = [];
      const randIndex = ~~(Math.random() * 7)
      while (array.length < 3) {
        const randLetterIndex = ~~(Math.random() * 12)
        if (!(array.includes(randLetterIndex) || strs[randIndex][randLetterIndex] === ' ')) {
          array.push(randLetterIndex);
        }
      }
      let string = ''
      for (let i = 0; i < 12; i++) {
        if (!array.includes(i)) {
          string = string + strs[randIndex][i]
        } else {
          string = string + '#'
        }
      }
      setGameStr(string);
      setPlayerStr(string);
      setSolutionStr(strs[randIndex]);
    }, [change])

    function handleChange (pos, val) {
      let lettercheck = val;
      if (!val) {
        lettercheck = '#'
      };
      const currString = playerStr;
      setPlayerStr(currString.substring(0, pos) + lettercheck + currString.substring(pos + 1));
    }

    React.useEffect(() => {
      if ((playerStr === solutionStr) && playerStr.length === 12) {
        const timeoutId = setTimeout(() => {
          alert('CORRECT');
          localStorage.setItem('counter', parseInt(localStorage.getItem('counter'), 10) + 1);
          setChange(c => !c);
        }, 200)
        return () => clearTimeout(timeoutId);
      }
    }, [playerStr, solutionStr])

    return (
      <main>
        <div className='blankoPage'>
          <div className='blankoContainer'>
            {
              gameStr && 
              <>
                {squareArray.map((num) => {
                  return <div key={`${num}blankosquare`} className='letterSquare'>
                    {gameStr[num] !== '#'
                      ? <>{gameStr[num]}</>
                      : <input type="text" maxLength={1} onChange={(e) => handleChange(num, e.target.value)} value={playerStr[num] === '#' ? '' : playerStr[num]}></input>
                    }
                  </div>
                })}
              </>
            }
          </div>
          <button className='resetBlanko' onClick={() => setChange(!change)}>Reset</button>
        </div>
      </main>
    )
  }

  const Tetro = () => {
    return (
      <main>
        <div className='pageContainer'>Tetro</div>
      </main>
    ) 
  }
  const Footer = () => {
    return (
      <footer>
      </footer>
    )
  }
  return (
    <>
      <BrowserRouter>
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blanko" element={<Blanko />} />
          <Route path="/slido" element={<Slido />} />
          <Route path="/tetro" element={<Tetro />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
