import React, { useState, useEffect } from "react";

const CountdownTimer = ({ initialTime }) => {
  const [time, setTime] = useState(initialTime);

  useEffect(() => {
    const intervalId = setInterval(() => {
        setTime((prevTime) => {
            if (prevTime <= 0) {
              clearInterval(intervalId);
              return 0;
            } else {
              return prevTime - 1;
            }
          });
        }, 1000);

    return () => clearInterval(intervalId);
  }, []);

const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return <div>{formatTime(time)}</div>;
};

export default CountdownTimer;

