import React, {useEffect, useState} from 'react';
import './App.css';
import MenuButton from './MenuButton';
import {
    formatTimestampToTime,
    formatTimestampToDate,
    getNumberOfPassengers,
    getBerth,
    getEstimatedTimeOfArrival,
    getPortCallsByWeekdayAndPort,
    getTimeDifference,
} from './utils';


function App() {
    const [portCallData, setPortCallData] = useState({ dataUpdatedTime: null, portCalls: [] });
    const [selectedWeekday, setSelectedWeekday] = useState(null);
    const [selectedPort, setSelectedPort] = useState(null);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isMenuOpen, setMenuOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isSimplifiedPortSelection, setIsSimplifiedPortSelection] = useState(false);


    function fetchData() {
        fetch('https://meri.digitraffic.fi/api/port-call/v1/port-calls')
            .then(response => response.json())
            .then(data => {
                setPortCallData({
                    dataUpdatedTime: data.dataUpdatedTime,
                    portCalls: Array.isArray(data.portCalls) ? data.portCalls : []
                });
            })
            .catch(error => console.error('Error fetching data:', error));
    }

    function setupInterval() {
        const intervalId = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        // Clean up the interval when the component unmounts
        return () => clearInterval(intervalId);
    }

    useEffect(() => {
        fetchData();
        setupInterval();
    }, []);

    const toggleMenu = () => {
        setMenuOpen(!isMenuOpen);
    };

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    };

    const toggleSimplifiedPortSelection = () => {
        setIsSimplifiedPortSelection(!isSimplifiedPortSelection);
    };


    function handleWeekdayButtonClick(weekday) {
        setSelectedWeekday(weekday);
    }

    function handlePortButtonClick(port) {
        setSelectedPort(port);
    }

    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    let uniquePorts;

    if (isSimplifiedPortSelection === true){
         uniquePorts = ['FIECK', 'FIHEL', 'FITKU', 'FILAN', 'FINLI', 'FIMHQ', 'FIVAA']
    } else {
         uniquePorts = Array.from(new Set(portCallData.portCalls.map(portCall => portCall.portToVisit)));
    }

    return (
        <div className={`App ${isMenuOpen ? 'menu-open' : ''} ${isDarkMode ? 'dark-mode' : ''}`}>
            <MenuButton onClick={toggleMenu} isDarkMode={isDarkMode} />

            <div className={`menu ${isMenuOpen ? 'slide-in' : 'slide-out'}`}>
                <button onClick={toggleDarkMode}>
                    {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                </button>
                <button onClick={toggleSimplifiedPortSelection}>
                    {isSimplifiedPortSelection ? 'Disable Simplified Port Selection' : 'Enable Simplified Port Selection'}
                </button>
            </div>

            <div>
                <h1>Vessel Passenger Check</h1>
                <p>Current Time: {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}</p>
                <p>Data Updated Time: {formatTimestampToDate(portCallData.dataUpdatedTime)}</p>
            </div>

            <div>
                {/* Buttons for filtering by weekday */}
                {weekdays.map((day, index) => (
                    <button
                        key={index}
                        className={selectedWeekday === index ? 'pressed' : ''}
                        onClick={() => handleWeekdayButtonClick(index)}
                    >
                        {day}
                    </button>
                ))}
            </div>

            <div>
                {/* Buttons for filtering by port */}
                {uniquePorts.map((port, index) => (
                    <button
                        key={index}
                        className={selectedPort === port ? 'pressed' : ''}
                        onClick={() => handlePortButtonClick(port)}
                    >
                        {port}
                    </button>
                ))}
            </div>

            <div>
                {/* Render port calls for the selected weekday and port */}
                {selectedWeekday !== null && selectedPort !== null &&
                    getPortCallsByWeekdayAndPort(portCallData, selectedWeekday, selectedPort).map(portCall => (
                        <div key={portCall.portCallId}>
                            <strong>Vessel:</strong> {portCall.vesselName}, <strong>ETA:</strong> {formatTimestampToTime(getEstimatedTimeOfArrival(portCall))},
                            <strong> T-</strong>{getTimeDifference(currentTime, portCall.portAreaDetails[0].eta)} Hours
                            <p>Number of Passengers: {getNumberOfPassengers(portCall)}</p>
                            <p>Port of Arrival: {getBerth(portCall)}</p>
                        </div>
                    ))}
            </div>
        </div>
    );

}

export default App;
