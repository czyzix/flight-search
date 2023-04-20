import { useState } from "react";

const OriginInput = ({ origin, originSuggestion, isOriginErrorMessage, handleOriginChange, handleOriginClick }) => {

    const [isOriginSuggestionFocused, setIsOriginSuggestionFocused] = useState(false);
    const handleOriginSuggestionInputFocus = () => {
        setIsOriginSuggestionFocused(true);
    };
    const handleOriginSuggestionInputBlur = () => {
        setIsOriginSuggestionFocused(false);
    };

    return (
        <div className="element origin">
            <label>From:</label>
            <input
                type="text"
                className={`left-input ${isOriginErrorMessage ? "error" : ""}`}
                placeholder="Airport IATA code..."
                value={origin}
                onChange={handleOriginChange}
                onFocus={handleOriginSuggestionInputFocus}
                onBlur={handleOriginSuggestionInputBlur}
                minLength="3"
                maxLength="3"
                required />
            {isOriginSuggestionFocused && origin.length === 3 && (
                isOriginErrorMessage
                    ? <p className="error-message">Invalid IATA code</p>
                    : (originSuggestion.iataCode && (
                        <p className="suggestion" onClick={handleOriginClick}>
                            {originSuggestion.iataCode} - {originSuggestion.name}, {originSuggestion.alpha2countryCode}
                        </p>
                    ))
            )}
        </div>
    );
}

export default OriginInput;