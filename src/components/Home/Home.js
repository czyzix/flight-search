import "./Home.css"
import { useState, useEffect } from "react";
import FlightList from "../FlightList/FlightList";
import { TOKEN_API_URL, TODAY } from "../../constants"
import OriginInput from "../OriginInput/OriginInput";
import DestinationInput from "../DestinationInput/DestinationInput";


const Home = () => {

    const [origin, setOrigin] = useState("");
    const [originSuggestion, setOriginSuggestion] = useState('');
    const [isOriginErrorMessage, setOriginErrorMessage] = useState(false);
    const [destination, setDestination] = useState("");
    const [destinationSuggestion, setDestinationSuggestion] = useState('');
    const [isDestinationErrorMessage, setDestinationErrorMessage] = useState(false);
    const [departureDate, setDepartureDate] = useState("");
    const [returnDate, setReturnDate] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [accessToken, setAccessToken] = useState('');
    const [flights, setFlights] = useState(null);

    useEffect(() => {
        if (origin) {
            fetchAirports(origin, setOriginSuggestion, setOriginErrorMessage);
        }
    }, [origin]);

    useEffect(() => {
        if (destination) {
            fetchAirports(destination, setDestinationSuggestion, setDestinationErrorMessage);
        }
    }, [destination]);

    useEffect(() => {
        const fetchToken = async () => {

            const payload = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: "grant_type=client_credentials&client_id=w79cfJjFiHlntapG7swLoPgl1nffyGvC&client_secret=dA9FFdNGKFgagrln",
            }

            const response = await fetch(TOKEN_API_URL, payload);
            const data = await response.json();
            setAccessToken(data.access_token);
        };
        fetchToken();
    }, []);

    const handleOriginChange = (e) => {
        setOrigin(e.target.value.toUpperCase());
        setOriginSuggestion([]);
        setOriginErrorMessage(false);
    };
    const handleOriginClick = () => {
        setOrigin(originSuggestion.iataCode)
        setOriginSuggestion([]);
    };
    const handleDestinationChange = (e) => {
        setDestination(e.target.value.toUpperCase());
        setDestinationSuggestion([]);
        setDestinationErrorMessage(false);
    };
    const handleDestinationClick = () => {
        setDestination(destinationSuggestion.iataCode)
        setDestinationSuggestion([]);
    };
    const handleDepartureDateChange = (e) => {
        const { value } = e.target;
        setDepartureDate(value);
    };
    const handleReturnDateChange = (e) => {
        const { value } = e.target;
        setReturnDate(value);
    };
    const apiFlightsUrl = `https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${origin}&destinationLocationCode=${destination}&departureDate=${departureDate}&returnDate=${returnDate}&adults=1&nonStop=false&max=10`;

    const handleSearch = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setFlights(null)

        fetch(apiFlightsUrl, {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        })
            .then(res => res.json())
            .then(data => setFlights(data))
            .catch(error => console.error(error))
            .finally(() => setIsLoading(false))
    };

    const fetchAirports = async (inputValue, setSuggestion, setErrorMessage) => {

        if (inputValue.length >= 3) {
            try {
                const apiAirportsCodes = `https://aviation-reference-data.p.rapidapi.com/airports/${inputValue}`

                const response = await fetch(
                    apiAirportsCodes,
                    {
                        headers: {
                            // TO DO: wrzucic klucze do env files
                            "x-rapidapi-host": "aviation-reference-data.p.rapidapi.com",
                            "x-rapidapi-key": "b2008d7d15mshce0078fda594bb6p16af45jsna78e90852f3f",
                        },
                    }
                );

                if (response.status === 404) {
                    setSuggestion([]);
                    setErrorMessage(true);
                } else {
                    const data = await response.json();
                    setSuggestion(data);
                    setErrorMessage(false);
                }
            } catch (error) {
                console.error(error);
            }
        }
    };

    return (
        <>
            <div className="home-wrapper">
                <div className="form-wrapper">
                    <form onSubmit={handleSearch}>
                        <div>
                            <div className="inputs-wraper">
                                <div className="text-inputs">
                                    <OriginInput
                                        origin={origin}
                                        originSuggestion={originSuggestion}
                                        isOriginErrorMessage={isOriginErrorMessage}
                                        handleOriginChange={handleOriginChange}
                                        handleOriginClick={handleOriginClick}
                                    />
                                    <DestinationInput
                                        destination={destination}
                                        destinationSuggestion={destinationSuggestion}
                                        isDestinationErrorMessage={isDestinationErrorMessage}
                                        handleDestinationChange={handleDestinationChange}
                                        handleDestinationClick={handleDestinationClick}
                                    />
                                </div>
                                <div className="date-inputs">
                                    <div className="element depart">
                                        <label>Depart</label>
                                        <input type="date" className="left-input" min={TODAY} value={departureDate} onChange={handleDepartureDateChange} required />
                                    </div>
                                    <div className="element return">
                                        <label>Return</label>
                                        <input type="date" className="right-input" min={TODAY} value={returnDate} onChange={handleReturnDateChange} required />
                                    </div>
                                </div>
                            </div>
                            <div className="iata-link-wrapper">
                                <b>Search IATA code <a href="https://www.iata.org/en/publications/directories/code-search/" target="_blank">here</a></b>
                            </div>
                        </div>
                        <button className="search-btn" disabled={isOriginErrorMessage || isDestinationErrorMessage}>SEARCH</button>
                    </form>
                </div>
                <div className="loader-wrapper">
                    {isLoading && <div className="loader"><div></div><div></div></div>}
                </div>
                <div className="flights-wrapper">
                    {flights && <FlightList flights={flights.data} />}
                </div>

            </div>
        </>
    );
}

export default Home;