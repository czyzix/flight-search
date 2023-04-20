import "./FlightList.css"
import { MdAirplanemodeInactive } from 'react-icons/md';
import { RiAlertFill } from 'react-icons/ri';


import Flight from "../Flight/Flight";

const FlightList = ({ flights }) => (
    <div>
        {flights?.length === 0 &&
            <div className="no-flights">
                <MdAirplanemodeInactive />
                <b>No available flights with this criteria</b>
            </div>}
        {flights?.length > 0 && <div className="flight-list">
            {flights.map((flight, index) => (
                <Flight key={index} flight={flight} />
            ))}
        </div>}
        {flights === undefined && <div className="check-data">
            <RiAlertFill />
            <b>Please check if dates match the current local time of the selected airports</b>
        </div>}
    </div>
);

export default FlightList;