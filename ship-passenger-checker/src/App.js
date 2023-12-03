import React, {useEffect, useState} from 'react';
import './App.css';

function App() {
    const [portCallData, setPortCallData] = useState({ dataUpdatedTime: null, portCalls: [] });
    const [selectedWeekday, setSelectedWeekday] = useState(null);
    const [selectedPort, setSelectedPort] = useState(null);

    useEffect(() => {
        fetch('https://meri.digitraffic.fi/api/port-call/v1/port-calls')
            .then(response => response.json())
            .then(data => {
                setPortCallData({
                    dataUpdatedTime: data.dataUpdatedTime,
                    portCalls: Array.isArray(data.portCalls) ? data.portCalls : []
                });
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    function formatTimestampToTime(timestamp) {
        const dateObject = new Date(timestamp);
        const month = dateObject.getMonth();
        const day = dateObject.getDate();

        const hours = dateObject.getHours();
        const minutes = dateObject.getMinutes();

        return `${String(day).padStart(2, '0')}.${String(month).padStart(2, '0')}
          @${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    }

    function formatTimestampToDate(timestamp) {
        const dateObject = new Date(timestamp);
        const day = dateObject.getDate();
        const month = dateObject.getMonth() + 1; // Adding 1 because months are zero-indexed
        const year = dateObject.getFullYear();
        const hours = dateObject.getHours();
        const minutes = dateObject.getMinutes();
        const seconds = dateObject.getSeconds();

        return `${String(day).padStart(2, '0')}.${String(month).padStart(2, '0')}.${year} ${String(hours).padStart(2, '0')}:${String(
            minutes
        ).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    function getNumberOfPassengers(portCall) {
        if (portCall && portCall.imoInformation && portCall.imoInformation.length > 0) {
            return portCall.imoInformation[0].numberOfPassangers;
        } else {
            return "N/A";
        }
    }

    function getEstimatedTimeOfArrival(portCall) {
        if (portCall && portCall.imoInformation && portCall.portAreaDetails.length > 0) {
            return formatTimestampToTime(portCall.portAreaDetails[0].eta);
        } else {
            return "N/A";
        }
    }

    function getPortCallsByWeekdayAndPort(weekday, port) {
        const filteredPortCalls = portCallData.portCalls.filter(portCall => {
            const portCallDate = new Date(portCall.portCallTimestamp);
            const isCorrectWeekday = portCallDate.getDay() === weekday;
            const isCorrectPort = portCall.portToVisit === port;
            return isCorrectWeekday && isCorrectPort;
        });

        // Sort the filtered port calls by ETA
        return filteredPortCalls.sort((a, b) => {
            const etaA = new Date(a.portAreaDetails[0].eta);
            const etaB = new Date(b.portAreaDetails[0].eta);
            return etaA - etaB;
        });
    }


    function handleWeekdayButtonClick(weekday) {
        setSelectedWeekday(weekday);
    }

    function handlePortButtonClick(port) {
        setSelectedPort(port);
    }

    const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const uniquePorts = ['FIECK', 'FIHEL', 'FITKU', 'FILAN', 'FINLI', 'FIMHQ', 'FIVAA']
    //const uniquePorts = Array.from(new Set(portCallData.portCalls.map(portCall => portCall.portToVisit)));

    return (
        <div className="App">
            <h1>Port Calls</h1>
            <p>Data Updated Time: {formatTimestampToDate(portCallData.dataUpdatedTime)}</p>

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
                    getPortCallsByWeekdayAndPort(selectedWeekday, selectedPort).map(portCall => (
                        <div key={portCall.portCallId}>
                            <strong>Vessel:</strong> {portCall.vesselName}, <strong>ETA:</strong> {getEstimatedTimeOfArrival(portCall)}
                            <p>Number of Passengers: {getNumberOfPassengers(portCall)}</p>
                        </div>
                    ))}
            </div>
        </div>
    );
}

export default App;
