import { useState } from "react";

const AirportInput = ({ value, suggestion, isError, onChange, onClick, className, label }) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <div className={"element airport " + className}>
            <label>{label}:</label>
            <input
                type="text"
                className={`destination-input ${isError ? "error" : ""}`}
                placeholder="Airport IATA code..."
                value={value}
                onChange={onChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                minLength="3"
                maxLength="3"
                required
            />
            {isFocused && value.length === 3 && (
                isError? (
                    <p className="error-message">Invalid IATA code</p>
                ) : (
                    suggestion.iataCode && (
                        <p className="suggestion" onClick={onClick}>
                            {suggestion.iataCode} - {suggestion.name},{" "}
                            {suggestion.alpha2countryCode}
                        </p>
                    )
                )
            )}
        </div>
    );
};

export default AirportInput;