import { useState } from "react";

const DestinationInput = ({ destination, destinationSuggestion, isDestinationErrorMessage, handleDestinationChange, handleDestinationClick }) => {

    const [isDestinationSuggestionFocused, setIsDestinationSuggestionFocused] = useState(false);
    const handleDestinationSuggestionInputFocus = () => {
        setIsDestinationSuggestionFocused(true);
    };
    const handleDestinationSuggestionInputBlur = () => {
        setIsDestinationSuggestionFocused(false);
    };
    
    return (
        <div className="element destination">
            <label>To:</label>
            <input
                type="text"
                className={`right-input ${isDestinationErrorMessage ? "error" : ""}`}
                placeholder="Airport IATA code..."
                value={destination}
                onChange={handleDestinationChange}
                onFocus={handleDestinationSuggestionInputFocus}
                onBlur={handleDestinationSuggestionInputBlur}
                minLength="3"
                maxLength="3"
                required />
            {isDestinationSuggestionFocused && destination.length === 3 && (
                isDestinationErrorMessage
                    ? <p className="error-message">Invalid IATA code</p>
                    : (destinationSuggestion.iataCode && (
                        <p className="suggestion" onClick={handleDestinationClick}>
                            {destinationSuggestion.iataCode} - {destinationSuggestion.name}, {destinationSuggestion.alpha2countryCode}
                        </p>
                    ))
            )}
        </div>
    );
}

export default DestinationInput;