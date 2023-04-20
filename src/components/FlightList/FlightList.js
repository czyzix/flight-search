import "./FlightList.css"
import { MdAirplanemodeInactive } from 'react-icons/md';
import { RiAlertFill } from 'react-icons/ri';


import Flight from "../Flight/Flight";

const FlightList = ({ flights }) => (
    <div className="flights-wrapper">
        {flights?.length === 0 &&
            <div className="no-flights">
                <MdAirplanemodeInactive />
                <b>No available flights with this criteria, try with different ones</b>
            </div>}
        {flights?.length > 0 && <div className="flight-list">
            {flights.map((flight, index) => (
                <Flight key={index} flight={flight} />
            ))}
        </div>}
        {flights === undefined && <div className="check-data">
            <RiAlertFill />
            <b>Please check if selected dates and airports are correct or try with different ones</b>
        </div>}
    </div>
)

export default FlightList;