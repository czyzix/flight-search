import "./Flight.css"
import { TbPlaneDeparture } from 'react-icons/tb';
import { IoIosAirplane } from "react-icons/io";

const Flight = ({ flight }) => {


    // TO DO : komponenty z wielkich liter
    const firstDeparture = flight.itineraries[0].segments[0].departure.at;
    const firstArrival = flight.itineraries[0].segments.slice(-1)[0].arrival.at;
    const firstItineraries = flight.itineraries[0].segments;
    const secondDeparture = flight.itineraries[1].segments[0].departure.at;
    const secondArrival = flight.itineraries[1].segments.slice(-1)[0].arrival.at;
    const secondItineraries = flight.itineraries[1].segments;

    return (
        <div className="fligh-card">
            <div>
                <div className="depart-card">
                    <TbPlaneDeparture className="icon" />
                    <div className="origin-destination">
                        <div className="time-date">
                            <p className="date">local time</p>
                            <b className="time">{firstDeparture.slice(11, 16)}</b>
                            <p className="date">{firstDeparture.slice(0, 10)}</p>
                        </div>
                        <div className="travel">
                            <p className="travel-inside">{firstItineraries[0].departure.iataCode}</p>
                            <IoIosAirplane className="icon" />
                            <p>{firstItineraries.slice(-1)[0].arrival.iataCode}</p>
                        </div>
                        <div className="time-date">
                            <p className="date">local time</p>
                            <b className="time">{firstArrival.slice(11, 16)}</b>
                            <p className="date">{firstArrival.slice(0, 10)}</p>
                        </div>
                    </div>
                    <div className="stops">
                        {firstItineraries.length > 2 && <b>{firstItineraries.length - 1} stops</b>}
                        {firstItineraries.length === 2 && <b>1 stop</b>}
                        {firstItineraries.length < 2 && <b>Direct</b>}
                        {firstItineraries.slice(0, -1).map((segment, index) => (
                            <p key={index}>{segment.arrival.iataCode}</p>
                        ))}
                    </div>
                </div>
                <div className="return-card">
                    <TbPlaneDeparture className="icon reverse" />
                    <div className="origin-destination">
                        <div className="time-date">
                            <p className="date">local time</p>
                            <b className="time">{secondDeparture.slice(11, 16)}</b>
                            <p className="date">{secondDeparture.slice(0, 10)}</p>
                        </div>
                        <div className="travel">
                            <p>{flight.itineraries[1].segments[0].departure.iataCode}</p>
                            <IoIosAirplane className="icon" />
                            <p>{flight.itineraries[1].segments.slice(-1)[0].arrival.iataCode}</p>
                        </div>
                        <div className="time-date">
                            <p className="date">local time</p>
                            <b className="time">{secondArrival.slice(11, 16)}</b>
                            <p className="date">{secondArrival.slice(0, 10)}</p>
                        </div>
                    </div>
                    <div className="stops">
                        {secondItineraries.length > 2 && <b>{secondItineraries.length - 1} stops</b>}
                        {secondItineraries.length === 2 && <b>1 stop</b>}
                        {firstItineraries.length < 2 && <b>Direct</b>}
                        {secondItineraries.slice(0, -1).map((segment, index) => (
                            <p key={index}>{segment.arrival.iataCode}</p>
                        ))}
                    </div>
                </div>
            </div>
            <div className="price-container">
                <b>PRICE:</b>
                <p>{flight.price.total}€</p>
            </div>
        </div>
    );
}
 
export default Flight;