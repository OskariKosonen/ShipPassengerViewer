export function formatTimestampToTime(timestamp) {
    const dateObject = new Date(timestamp);
    const month = dateObject.getMonth() + 1;
    const day = dateObject.getDate();

    const hours = dateObject.getHours();
    const minutes = dateObject.getMinutes();

    return `${String(day).padStart(2, '0')}.${String(month).padStart(2, '0')}
          @${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

export function formatTimestampToDate(timestamp) {
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

export function getNumberOfPassengers(portCall) {
    if (portCall && portCall.imoInformation && portCall.imoInformation.length > 0 && portCall.imoInformation[1].numberOfPassangers != null
        && portCall.imoInformation[1].numberOfPassangers > 2) {
        return portCall.imoInformation[1].numberOfPassangers;
    } else {
        return "N/A";
    }
}

export function getBerth(portCall){
    if (portCall && portCall.imoInformation && portCall.imoInformation.length > 0) {
        return portCall.portAreaDetails[0].portAreaName;
    } else {
        return "N/A";
    }
}

export function getEstimatedTimeOfArrival(portCall) {
    if (portCall && portCall.imoInformation && portCall.portAreaDetails.length > 0) {
        return portCall.portAreaDetails[0].eta;
    } else {
        return "N/A";
    }
}

export function getPortCallsByWeekdayAndPort(portCallData, weekday, port) {
    const filteredPortCalls = portCallData.portCalls.filter(portCall => {
        const portCallDate = new Date(portCall.portAreaDetails[0].eta);
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

export function getTimeDifference (timestamp1, timestamp2) {
    const time1 = new Date(timestamp1).getTime();
    const time2 = new Date(timestamp2).getTime();

    // Check if the timestamps are valid numbers
    if (isNaN(time1) || isNaN(time2)) {
        return NaN;
    }

    const timeDifferenceInMilliseconds = Math.abs(time1 - time2);
    const hours = Math.floor(timeDifferenceInMilliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifferenceInMilliseconds % (1000 * 60 * 60)) / (1000 * 60));

    // Pad single-digit minutes with a leading zero
    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;

    return `${hours}:${formattedMinutes}`;
}