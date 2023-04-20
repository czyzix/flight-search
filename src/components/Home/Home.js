import "./Home.css";
import { useState, useEffect } from "react";
import FlightList from "../FlightList/FlightList";
import AirportInput from "../AirportInput/AirportInput";
import Loader from "../Loader/Loader";
import { TOKEN_API_URL } from "../../constants";

const Home = () => {

    const [formState, setFormState] = useState({
        origin: "",
        originSuggestion: "",
        isOriginErrorMessage: false,
        destination: "",
        destinationSuggestion: "",
        isDestinationErrorMessage: false,
        departureDate: "",
        returnDate: ""
    });

    const [fetchingState, setFetchingState] = useState({
        isLoading: false,
        accessToken: "",
        flights: null
    });

    useEffect(() => {
        if (formState.origin) {
            fetchAirports(formState.origin, setFormState, 'originSuggestion', 'isOriginErrorMessage');
        }
    }, [formState.origin]);

    useEffect(() => {
        if (formState.destination) {
            fetchAirports(formState.destination, setFormState, 'destinationSuggestion', 'isDestinationErrorMessage');
        }
    }, [formState.destination]);

    useEffect(() => {
        const fetchToken = async () => {

            const payload = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `grant_type=client_credentials&client_id=${process.env.REACT_APP_AMADEUS_CLIENT_ID}&client_secret=${process.env.REACT_APP_AMADEUS_CLIENT_SECRET}`,
            }

            const response = await fetch(TOKEN_API_URL, payload);
            const data = await response.json();
            setFetchingState({ ...fetchingState, accessToken: data.access_token })
        };
        fetchToken();
    }, []);

    const handleOriginChange = (e) => {
        const newOrigin = e.target.value.toUpperCase();
        setFormState(prevState => ({
            ...prevState,
            origin: newOrigin,
            originSuggestion: [],
            isOriginErrorMessage: false
        }));
    };
    const handleOriginClick = () => {
        setFormState(prevState => ({
            ...prevState,
            origin: prevState.originSuggestion.iataCode,
            originSuggestion: []
        }));
    };
    const handleDestinationChange = (e) => {
        const newDestination = e.target.value.toUpperCase();
        setFormState(prevState => ({
            ...prevState,
            destination: newDestination,
            destinationSuggestion: [],
            isDestinationErrorMessage: false
        }));
    };
    const handleDestinationClick = () => {
        setFormState(prevState => ({
            ...prevState,
            destination: prevState.destinationSuggestion.iataCode,
            destinationSuggestion: []
        }));
    };
    const handleDepartureDateChange = (e) => {
        const { value } = e.target;
        setFormState(prevState => ({
            ...prevState,
            departureDate: value
        }));
    };
    const handleReturnDateChange = (e) => {
        const { value } = e.target;
        setFormState(prevState => ({
            ...prevState,
            returnDate: value
        }));
    };

    const getToday = () => new Date().toISOString().split("T")[0];
    const today = getToday();

    const fetchAirports = async (inputValue, setState, suggestionKey, errorKey) => {
        if (inputValue.length >= 3) {
            try {
                const apiAirportsCodes = `https://aviation-reference-data.p.rapidapi.com/airports/${inputValue}`
                const response = await fetch(
                    apiAirportsCodes,
                    {
                        headers: {
                            "x-rapidapi-host": "aviation-reference-data.p.rapidapi.com",
                            "x-rapidapi-key": `${process.env.REACT_APP_RAPID_API_KEY}`,
                        },
                    }
                );

                if (response.status === 404) {
                    setState(prevState => ({
                        ...prevState,
                        [suggestionKey]: [],
                        [errorKey]: true
                    }));
                } else {
                    const data = await response.json();
                    setState(prevState => ({
                        ...prevState,
                        [suggestionKey]: data,
                        [errorKey]: false
                    }));
                }
            } catch (error) {
                console.error(error);
            }
        }
    };

    const apiFlightsUrl = `https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${formState.origin}&destinationLocationCode=${formState.destination}&departureDate=${formState.departureDate}&returnDate=${formState.returnDate}&adults=1&nonStop=false&max=10`;

    const handleSearch = (e) => {
        e.preventDefault();
        setFetchingState(prevState => ({
            ...prevState,
            isLoading: true,
            flights: null
        }));

        fetch(apiFlightsUrl, {
            headers: {
                "Authorization": `Bearer ${fetchingState.accessToken}`
            }
        })
            .then(res => res.json())
            .then(data => setFetchingState(prevState => ({
                ...prevState,
                flights: data
            })))
            .catch(error => console.error(error))
            .finally(() => {
                setFetchingState(prevState => ({
                    ...prevState,
                    isLoading: false
                }));
            });
    };

    return (
            <div className="home-wrapper">
                <div className="form-wrapper">
                    <form onSubmit={handleSearch}>
                        <div>
                            <div className="inputs-wraper">
                                <div className="text-inputs">
                                    <AirportInput
                                        value={formState.origin}
                                        suggestion={formState.originSuggestion}
                                        isError={formState.isOriginErrorMessage}
                                        onChange={handleOriginChange}
                                        onClick={handleOriginClick}
                                        className={"origin"}
                                        label={"From"}
                                    />
                                    <AirportInput
                                        value={formState.destination}
                                        suggestion={formState.destinationSuggestion}
                                        isError={formState.isDestinationErrorMessage}
                                        onChange={handleDestinationChange}
                                        onClick={handleDestinationClick}
                                        className={"destination"}
                                        label={"To"}
                                    />
                                </div>
                                <div className="date-inputs">
                                    <div className="element depart">
                                        <label>Depart</label>
                                        <input type="date" className="left-input" min={today} value={formState.departureDate} onChange={handleDepartureDateChange} required />
                                    </div>
                                    <div className="element return">
                                        <label>Return</label>
                                        <input type="date" className="right-input" min={today} value={formState.returnDate} onChange={handleReturnDateChange} required />
                                    </div>
                                </div>
                            </div>
                            <div className="iata-link-wrapper">
                                <b>Search IATA code <a href="https://www.iata.org/en/publications/directories/code-search/" target="_blank">here</a></b>
                            </div>
                        </div>
                        <button className="search-btn" disabled={formState.isOriginErrorMessage || formState.isDestinationErrorMessage}>SEARCH</button>
                    </form>
                </div>
                <Loader isLoading={fetchingState.isLoading} />
                {fetchingState.flights && <FlightList flights={fetchingState.flights.data} />}
            </div>
    );
}

export default Home;