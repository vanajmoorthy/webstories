import React, { useEffect, useState } from "react"
import styled from "styled-components"

const breakpoint = "820px"

const events = {
  "we first met": new Date("2023-10-23T21:08:20"), // 23rd October 2023, 9:08:20 PM
  "i knew i liked you": new Date("2024-01-27T22:37:42"), // 27th January 2024, 10:37:42 PM
  "we first kissed": new Date("2024-02-17T03:15:12"), // 17th February 2024, 3:15:12 AM
  "we started dating": new Date("2024-03-24T10:20:18"), // 24th March 2024, 10:20:18 AM
}

const TimeSince = () => {
  const [selectedEvent, setSelectedEvent] = useState("we first met")
  const [elapsedTime, setElapsedTime] = useState({})

  // Function to calculate elapsed time
  const calculateElapsedTime = () => {
    const now = new Date()
    const eventDate = events[selectedEvent]
    const diff = Math.max(now - eventDate, 0)

    const seconds = Math.floor((diff / 1000) % 60)
    const minutes = Math.floor((diff / 1000 / 60) % 60)
    const hours = Math.floor((diff / 1000 / 60 / 60) % 24)
    const days = Math.floor(diff / 1000 / 60 / 60 / 24)

    setElapsedTime({ days, hours, minutes, seconds })
  }

  useEffect(() => {
    calculateElapsedTime()

    const intervalId = setInterval(calculateElapsedTime, 1000)
    return () => clearInterval(intervalId)
  }, [selectedEvent])

  const handleChange = (event) => {
    setSelectedEvent(event.target.value)
    calculateElapsedTime()
  }

  return (
    <Div>
      <H2>
        It has been{" "}
        <Holder>
          <Days>{elapsedTime.days} days,</Days> <Hours> {elapsedTime.hours} hours,</Hours>
        </Holder>{" "}
        <Holder>
          <Minutes> {elapsedTime.minutes} minutes,</Minutes> <And>and</And>{" "}
          <Seconds>{elapsedTime.seconds} seconds </Seconds>
        </Holder>{" "}
        since
        <Select value={selectedEvent} onChange={handleChange}>
          {Object.keys(events).map((event) => (
            <Option key={event} value={event}>
              {event}
            </Option>
          ))}
        </Select>
      </H2>
      <Subtitle>And my life changed forever. </Subtitle>
    </Div>
  )
}

const Div = styled.div`
  margin-top: 20rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;

  @media (max-width: 870px) {
  }
`

const Holder = styled.span`
  display: flex;
  align-items: center;
`

const H2 = styled.h2`
  font-family: "Instrument";
  font-weight: 800;
  font-size: 1.7rem;
  display: flex;
  align-items: center;

  @media (max-width: ${breakpoint}) {
    flex-direction: column;
  }
`

const Subtitle = styled.h2`
  font-family: "InstrumentItalic";
  font-weight: 800;
  font-size: 1.7rem;
  align-items: center;
  color: #ff6f58;
  margin-top: 1rem;
`

const And = styled.span`
  @media (max-width: 870px) {
    height: 34px;
  }
`

const Select = styled.select`
  font-family: "Instrument";
  font-size: 1.7rem;
  margin-left: 0.5rem;
  background-color: #fff2f1;
  color: black;
  border: 1px solid #fab5aa;
  border-radius: 4px;
  padding: 0.1rem 0.2rem;
  cursor: pointer;

  /* Add styles for the focused state */
  &:focus {
    outline: none;
    border-color: #c7bdff;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25); /* Add a box shadow */
  }

  @media (max-width: ${breakpoint}) {
    text-align: center;
    margin: 10px 0px;
  }
`

const Option = styled.option`
  font-size: 1rem !important;
`

const Days = styled.p`
  border-bottom: 12px solid #ffabab;
  width: max-content;
  margin: 0rem 0.5rem;
  height: 18px;
  margin-bottom: 5px;

  @media (max-width: 870px) {
  }
`

const Hours = styled.p`
  border-bottom: 12px solid #c7bdff;
  width: max-content;
  margin: 0rem 0.5rem;
  height: 18px;
  margin-bottom: 5px;

  @media (max-width: 870px) {
    margin-left: 0.5rem;
  }
`

const Minutes = styled.p`
  border-bottom: 12px solid #b1f8b9;
  width: max-content;
  margin: 0rem 0.5rem;
  height: 18px;
  margin-bottom: 5px;

  @media (max-width: 870px) {
  }
`

const Seconds = styled.p`
  border-bottom: 12px solid #ffe096;
  width: max-content;
  margin: 0rem 0.5rem;
  height: 18px;
  margin-bottom: 5px;

  @media (max-width: 870px) {
  }
`

export default TimeSince
