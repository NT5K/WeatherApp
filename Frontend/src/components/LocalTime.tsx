import React, { useState, useEffect } from 'react';

const LocalTime: React.FC = () => {
    // Define time state
    const [time, setTime] = useState<Date>(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // Return the local time
    return (
        <>
        {time.toLocaleTimeString()}{" "}
        </>
    );
};

export default LocalTime;
