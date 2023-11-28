"use client";
import { useCallback, useState } from "react";
import Image from "next/image";

import Spinner from "./components/Spinner";

const OMDB_URL = "http://www.omdbapi.com";
const OMDB_API_KEY = process.env.NEXT_PUBLIC_OMDB_API_KEY;

const TMDB_URL = "https://api.themoviedb.org/3";
const TMDB_JWT_KEY = process.env.NEXT_PUBLIC_TMDB_JWT_KEY;

const IMAGE_PLACEHOLDER =
  "https://cringemdb.com/img/movie-poster-placeholder.png";

const IMAGE_TMDB_URL = "https://image.tmdb.org/t/p/w500";

const EMPTY_TMDB_RESULT = {
  adult: undefined,
  backdrop_path: undefined,
  genre_ids: undefined,
  id: undefined,
  media_type: undefined,
  original_language: undefined,
  original_title: undefined,
  overview: undefined,
  popularity: undefined,
  poster_path: undefined,
  release_date: undefined,
  title: undefined,
  video: undefined,
  vote_average: undefined,
  vote_count: undefined,
};

export default function Home() {
  const [query, setQuery] = useState("");
  const [resultsOMDB, setResultsOMDB] = useState();
  const [resultsTMDB, setResultsTMDB] = useState();
  const [loadingOMDB, setLoadingOMDB] = useState(false);
  const [loadingTMDB, setLoadingTMDB] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const searchFilms = useCallback(async () => {
    setNotFound(false);
    setLoadingTMDB(true);
    setLoadingOMDB(true);
    setResultsTMDB(EMPTY_TMDB_RESULT);
    // OMDB
    try {
      const dataOMDB = await fetch(
        `${OMDB_URL}/?t=${query}&apikey=${OMDB_API_KEY}`
      );
      console.log("dataOMDB", dataOMDB);
      const movieOnOMDB = await dataOMDB.json();
      setResultsOMDB(movieOnOMDB);

      if (!movieOnOMDB.imdbID && movieOnOMDB.Error) {
        setNotFound(true);
        setResultsOMDB();
      } else {
        setLoadingOMDB(false);
        // TMDB
        const dataTMDB = await fetch(
          `${TMDB_URL}/find/${movieOnOMDB.imdbID}?external_source=imdb_id`,
          {
            headers: {
              Authorization: `Bearer ${TMDB_JWT_KEY}`,
              accept: "application/json",
            },
          }
        );
        console.log("dataTMDB", dataTMDB);
        const movieOnTMDB = await dataTMDB.json();
        Object.values(movieOnTMDB).forEach((value) => {
          if (value.length) {
            console.log("dataTMDB value", value[0]);
            setResultsTMDB(value[0]);
          }
        });
      }
      setLoadingOMDB(false);
      setLoadingTMDB(false);
    } catch (err) {
      console.log(err);
    }
  }, [query]);

  const renderCard = useCallback(
    (
      resultsOMDB,
      {
        adult,
        backdrop_path,
        genre_ids,
        id,
        media_type,
        original_language,
        original_title,
        overview,
        popularity,
        poster_path,
        release_date,
        title,
        video,
        vote_average,
        vote_count,
      }
    ) => {
      const {
        Actors,
        Awards,
        Country,
        Director,
        imdbRating,
        imdbVotes,
        Language,
        Metascore,
        BoxOffice,
        Plot,
        Poster,
        Rated,
        Ratings, //array de opciones con Source y Value
        Released,
        Runtime,
        Title,
        Type,
        Writer,
      } = resultsOMDB;

      return (
        <div className="bg-white p-4 rounded shadow-md w-full">
          <div className="flex justify-center mb-4">
            {Poster && (
              <Image
                src={Poster && Poster !== "N/A" ? Poster : IMAGE_PLACEHOLDER}
                alt="Poster from OMDB"
                className="max-w-full h-auto border-4 border-indigo-200"
                width={200}
                height={300}
              />
            )}
            {loadingTMDB ? (
              <Spinner />
            ) : (
              <Image
                src={
                  poster_path
                    ? `${IMAGE_TMDB_URL}${poster_path}`
                    : IMAGE_PLACEHOLDER
                }
                alt="Poster from TMDB"
                className="max-w-full h-auto border-4 border-pink-200"
                width={200}
                height={300}
              />
            )}
            {loadingTMDB ? (
              <Spinner />
            ) : (
              <Image
                src={
                  backdrop_path
                    ? `${IMAGE_TMDB_URL}${backdrop_path}`
                    : IMAGE_PLACEHOLDER
                }
                alt="Photo from TMDB"
                className="max-w-full h-auto border-4 border-pink-200"
                width={backdrop_path ? 450 : 200}
                height={backdrop_path ? 253 : 300}
              />
            )}
          </div>
          <h2 className="text-lg font-semibold bg-indigo-200">{Title}</h2>
          <p className="text-gray-600 bg-indigo-200">Plot: {Plot}</p>
          {Plot !== overview && (
            <p className="text-gray-600 bg-pink-200">Overview: {overview}</p>
          )}
          <p className="text-gray-700 font-semibold bg-indigo-200">
            Type: {Type[0].toUpperCase()}
            {Type.slice(1)}
          </p>
          <p className="text-gray-700 font-semibold bg-indigo-200">
            Runtime: {Runtime}
          </p>
          <p className="text-gray-700 font-semibold bg-indigo-200">
            Director: {Director}
          </p>
          <p className="text-gray-700 font-semibold bg-indigo-200">
            Writer: {Writer}
          </p>
          <p className="text-gray-700 font-semibold bg-indigo-200">
            Actors: {Actors}
          </p>
          <p className="text-gray-700 font-semibold bg-indigo-200">
            Awards: {Awards}
          </p>
          <p className="text-gray-700 font-semibold bg-indigo-200">
            Released: {Released}
          </p>
          <p className="text-gray-700 font-semibold bg-indigo-200">
            Language: {Language}
          </p>
          <p className="text-gray-700 font-semibold bg-indigo-200">
            Country: {Country}
          </p>
          <p className="text-gray-700 font-semibold bg-indigo-200">
            BoxOffice: {BoxOffice}
          </p>
          <p className="text-gray-700 font-semibold mt-2">Ratings:</p>
          <div className="flex justify-center">
            <div className="flex flex-col bg-indigo-200 p-3 m-3 rounded-md">
              <p className="font-bold">IMDB</p>
              <p>Rating: {imdbRating}</p>
              <p>Votes: {imdbVotes}</p>
            </div>
            <div className="flex flex-col bg-indigo-200 p-3 m-3 rounded-md">
              <p className="font-bold">Metascore</p>
              <p>Rating: {Metascore}</p>
            </div>
            {Ratings.length && Ratings?.[1]?.Source === "Rotten Tomatoes" && (
              <div className="flex flex-col bg-indigo-200 p-3 m-3 rounded-md">
                <p className="font-bold">Rotten Tomatoes</p>
                <p>Rating: {Ratings[1].Value}</p>
              </div>
            )}
            <div className="flex flex-col bg-pink-200 p-3 m-3 rounded-md">
              <p className="font-bold">The Movie Database</p>
              <p>Rating: {vote_average}</p>
              <p>Votes: {vote_count}</p>
            </div>
          </div>
        </div>
      );
    },
    [loadingTMDB]
  );

  return (
    <main
      className={`flex min-h-screen flex-col items-center p-12 ${
        resultsOMDB ? "pt-4" : ""
      }`}
    >
      <div className="bg-white p-8 rounded shadow-md w-2/5 mb-4">
        <h1 className="text-2xl font-semibold mb-4 text-gray-800">Movie4x4</h1>
        <div className="flex items-center">
          <input
            type="text"
            className="p-2 border border-gray-300 rounded mr-2 w-full text-gray-800"
            placeholder="Ingrese el título de su película, serie, etc..."
            value={query}
            onChange={({ target }) => setQuery(target.value)}
          />
          <button
            className="bg-blue-500 text-white p-2 rounded"
            onClick={searchFilms}
          >
            Buscar
          </button>
        </div>
      </div>
      {notFound && (
        <p className="font-bold">No se han encontrado resultados!</p>
      )}
      {loadingOMDB && <Spinner />}
      {!!resultsOMDB && (
        <>
          <div className="flex flex-col mb-4">
            <div className="flex items-center">
              <div className={`w-4 h-4 rounded-full mr-2 bg-indigo-200`} />
              <span>The OpenMovie Database</span>
            </div>
            <div className="flex items-center">
              <div className={`w-4 h-4 rounded-full mr-2 bg-pink-200`} />
              <span>The Movie Database</span>
            </div>
          </div>
          {renderCard(resultsOMDB, resultsTMDB)}
        </>
      )}
    </main>
  );
}
