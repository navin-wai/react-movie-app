import {useEffect , useState} from 'react';
import {useDebounce} from 'react-use';
import Shuffle from './components/Shuffle';

import Spinner from "./components/spinner";
import Search from "./components/Search";
import MovieCard from "./components/MovieCard";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS ={
  method: "GET",
  headers:{
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}
const App = () => {

  const [searchTerm , setSearchTerm] = useState("");

  const [errorMessage , setErrorMessage] = useState("");

  const [movieList , setMovieList] = useState([]);
  const [isLoading , setIsLoading] = useState(false);
  //debounce the search tearm to prevent making too many api req,
  //by waiting for the user to stop typing for 500ms
  const [debouncedSearchTerm , setDebouncedSearchTerm ] = useState("");
  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500 , [searchTerm]);

const fetchMovies = async (query = "") => {
  setIsLoading(true);
  setErrorMessage("");

  try {
   const endpoint = query
  ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
  : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

    const response = await fetch(endpoint, API_OPTIONS);

    if (!response.ok) {
      throw new Error('failed to fetch movie');
    }

    const data = await response.json();
    if(data.response == "false"){
      setErrorMessage(data.Error || "failed to fetch movies");
      setMovieList([]);
      return;
    }
    console.log(data)
    setMovieList(data.results || []);
  } catch (error) {
    console.log(`error fetching movies : ${error}`);
    setErrorMessage('error fetching movies. Please try again later');
  }finally{
    setIsLoading(false);
  }
};


  useEffect(() =>{
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  return (
    <main>
      <div className="pattern"/>
      <div className='wrapper pt-5'> 

        <Shuffle 
  text="Movie Zone"
  loop={true}
  loopDelay={0.5}
  colorFrom="#6d4ba3"
  colorTo="white"
  shuffleDirection="right"
  duration={0.35}
  animationMode="evenodd"
  shuffleTimes={1}
  ease="power3.out"
  stagger={0.03}
  threshold={0.1}
  triggerOnce={true}
  triggerOnHover={true}
  respectReducedMotion={true}
/>


        <header className="mt-0">
          <img src="./hero.png" alt="Hero banner" className="w-full h-[400px] object-cover object-center"/>
          <h1>Find <span className="text-gradient">Movies</span> You'll Enjoy Without The Hassle</h1>
        

        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}></Search>
        </header>

        <section className="all-movies">
          <h2 className="mt-[40px]">All Movies</h2>
        
          {isLoading ? (
            <Spinner></Spinner>
          ): errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ): (
            <ul>
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie}></MovieCard>
              ))}
            </ul>
          )}
        </section>
      </div>
     </main>
  )
}

export default App
