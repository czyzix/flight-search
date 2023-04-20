import "./Loader.css"

const Loader = ({ isLoading }) => {
    return (
        <div className="loader-wrapper">
            {isLoading && <div className="loader"><div></div><div></div></div>}
        </div>
    );
}

export default Loader;