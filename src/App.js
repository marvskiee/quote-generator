import logo from "./logo.svg";
import "./App.css";
import { useState, useRef, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [image, setImage] = useState(null);
  const [quotes, setQuotes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [innerLoading, setInnerLoading] = useState(false);
  const mounted = useRef();

  const fetch = async () => {
    setInnerLoading(true);
    setTimeout(async () => {
      const getImageAPI = axios.get(
        `https://source.unsplash.com/random?orientation=landscape`
      );
      const getQuotesAPI = axios.get(`https://api.quotable.io/random`);
      await axios
        .all([getImageAPI, getQuotesAPI])
        .then(
          axios.spread((...allData) => {
            const getImage = allData[0].request.responseURL;
            const getQuotes = allData[1].data;
            setImage(getImage);
            setQuotes(getQuotes);
            setLoading(false);
            setInnerLoading(false);
          })
        )
        .catch((err) => console.log(err));
    }, 500);
  };
  useEffect(() => {
    if (!mounted.current) {
      fetch();
      mounted.current = true;
    }
  });
  return loading ? (
    <div>loading</div>
  ) : (
    <>
      <div className="wrapper">
        <img id="bg-image" src={image} />
      </div>
      <div className="quotes">
        <p className="quotes-content">{quotes.content}</p>
        <p className="quotes-author">- {quotes.author}</p>
        {innerLoading ? (
          <button>Loading...</button>
        ) : (
          <button
            onClick={() => {
              fetch();
            }}
          >
            Next
          </button>
        )}
      </div>
    </>
  );
};

export default App;
