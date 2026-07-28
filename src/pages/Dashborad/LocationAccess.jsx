
import {
    ChevronDown,
    Loader2,
    LocateFixed,
    MapPin,
    Search,
    X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { searchCity as searchCityApi } from "../../api/shopApi";
import "../../styles/LocationAccess.css";

export default function LocationSelector({
    city,
    onCityChange,
}) {

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [suggestions, setSuggestions] = useState([]);

    // tracks whether the current city came from geolocation (green
    // "Detected" badge) vs picked manually (gray "Selected" badge)
    const [wasDetected, setWasDetected] = useState(false);

    const popularCities = [
        "Hosur",
        "Bangalore",
        "Chennai",
        "Coimbatore",
        "Salem",
        "Madurai",
        "Hyderabad",
        "Mumbai",
        "Delhi",
        "Pune",
    ];

    // ---------- Geolocation ----------

    const detectLocation = () => {

        if (!navigator.geolocation) {
            alert("Geolocation not supported");
            return;
        }

        setLoading(true);

        navigator.geolocation.getCurrentPosition(

            async (position) => {

                try {

                    const { latitude, longitude } = position.coords;

                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                    );

                    const data = await response.json();

                    const detectedCity =
                        data.address?.city ||
                        data.address?.town ||
                        data.address?.village ||
                        data.address?.county ||
                        "";

                    if (detectedCity) {

                        onCityChange(detectedCity);
                        setWasDetected(true);

                        setOpen(false);

                    } else {

                        alert("Unable to detect city");

                    }

                } catch (err) {

                    console.log(err);

                    alert("Unable to detect location");

                }

                setLoading(false);

            },

            () => {

                setLoading(false);

                alert("Location Permission Denied");

            }

        );

    };

    useEffect(() => {

        if (!city) {

            detectLocation();

        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ---------- City search — via OUR OWN backend, debounced ----------
    // FIX: no longer calls nominatim.openstreetmap.org directly from the
    // browser (that caused CORS errors, 429 rate-limits, AND irrelevant
    // fuzzy matches like "Ani" for the query "ku"). Our backend already
    // filters properly and sorts by relevance.

    const searchCity = async (keyword) => {
        try {
            const response = await searchCityApi(keyword);
            setSuggestions(response.data); // [{ city, state }, ...]

        } catch (err) {
            console.log(err);
            setSuggestions([]);
        }
    };

    // FIX: debounced — waits 500ms after typing stops, and requires at
    // least 3 characters (2 was too short, causing noisy fuzzy matches)
    useEffect(() => {
        if (search.trim().length < 3) {
            setSuggestions([]);
            return;
        }

        const timer = setTimeout(() => {
            searchCity(search);
        }, 500);

        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    // ---------- Choosing a city ----------

    const chooseCity = (selectedCity) => {

        onCityChange(selectedCity);
        setWasDetected(false);

        setSearch("");
        setSuggestions([]);
        setOpen(false);

    };

    const handleSearchKeyDown = (e) => {
        if (e.key === "Enter" && search.trim()) {
            chooseCity(search.trim());
        }
    };

    return (
        <>

            {/* Location Button */}

            <div
                className="locUI-pill"
                onClick={() => setOpen(true)}
            >

                <div className="locUI-left">

                    <MapPin
                        size={18}
                        className="locUI-icon"
                    />

                    <div>

                        <h4>

                            {city || "Choose Location"}

                        </h4>

                        <span>

                            Current Location

                        </span>

                        {city && (
                            <div className={`locUI-badge ${wasDetected ? "" : "locUI-badge-manual"}`}>
                                {wasDetected ? "📍 Detected" : "📍 Selected"}
                            </div>
                        )}

                    </div>

                </div>

                <ChevronDown size={18} />

            </div>

            {/* Modal — rendered via a portal straight into document.body,
                so it always centers on the true viewport regardless of
                any ancestor element using `transform` (which otherwise
                breaks position:fixed and was clipping this at the top) */}

            {open && createPortal(

                <div
                    className="locUI-overlay"
                    onClick={() => setOpen(false)}
                >

                    <div
                        className="locUI-modal"
                        onClick={(e) => e.stopPropagation()}
                    >

                        <div className="locUI-header">

                            <h2>

                                Select Location

                            </h2>

                            <button
                                className="locUI-close"
                                onClick={() => setOpen(false)}
                            >

                                <X size={18} />

                            </button>

                        </div>

                        <button
                            className="locUI-currentBtn"
                            onClick={detectLocation}
                            disabled={loading}
                        >

                            {loading ? (

                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        gap: "15px"
                                    }}
                                >

                                    <div className="locUI-loaderCircle">

                                        <Loader2
                                            size={32}
                                            className="locUI-spin"
                                        />

                                    </div>

                                    <span>

                                        Finding your location...

                                    </span>

                                </div>

                            ) : (
                                <>
                                    <LocateFixed size={18} />

                                    Use Current Location
                                </>
                            )}

                        </button>

                        <div className="locUI-divider">

                            <span>

                                OR

                            </span>

                        </div>

                        <div className="locUI-search">

                            <Search size={18} />

                            <input
                                placeholder="Search city..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={handleSearchKeyDown}
                            />

                            <button
                                className="locUI-setBtn"
                                onClick={() => {

                                    if (search.trim()) {

                                        chooseCity(search.trim());

                                    }

                                }}
                            >
                                Set
                            </button>

                        </div>

                        {/* FIX: uses the now-defined .locUI-suggestionList /
                            .locUI-suggestion CSS — this was rendering
                            unstyled before, which is why it looked like it
                            was floating/jumping oddly */}
                        {suggestions.length > 0 && (
                            <div className="locUI-suggestionList">
                                {suggestions.map((item, index) => (
                                    <div
                                        key={`${item.city}-${item.state}-${index}`}
                                        className="locUI-suggestion"
                                        onClick={() => chooseCity(item.city)}
                                    >
                                        <MapPin size={16} />
                                        <div className="locUI-suggestionText">
                                            <div className="locUI-suggestionCity">{item.city}</div>
                                            <div className="locUI-suggestionState">{item.state}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Popular cities — hidden while actively searching,
                            so the two lists don't visually compete */}
                        {search.trim().length < 3 && (
                            <>
                                <div className="locUI-title">

                                    Popular Cities

                                </div>

                                <div className="locUI-popularGrid">

                                    {popularCities.map(item => (

                                        <div
                                            key={item}
                                            className="locUI-chip"
                                            onClick={() => chooseCity(item)}
                                        >
                                            {item}
                                        </div>

                                    ))}

                                </div>
                            </>
                        )}

                    </div>

                </div>,

                document.body
            )}

        </>
    );

}