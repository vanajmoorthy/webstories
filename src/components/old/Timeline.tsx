import TimelineSection from "./TimelineSection"
import styled from "styled-components"

const Timeline = ({ onImageClick, clickedIndex, setClickedIndex, timelineData, sectionsRef }) => {
  const cumulativeStartingIndices = timelineData.reduce((acc, section, idx) => {
    if (idx === 0) {
      acc.push(0) // First section always starts at index 0
    } else {
      acc.push(acc[idx - 1] + timelineData[idx - 1].pictures.length)
    }
    return acc
  }, [])

  return (
    <Div>
      {/*<h1>Our Timeline</h1>*/}{" "}
      {timelineData.map((section, index) => (
        <TimelineSection
          key={index}
          ref={(el) => (sectionsRef.current[index] = el)}
          section={section}
          reverse={index % 2 !== 0}
          onImageClick={onImageClick}
          clickedIndex={clickedIndex}
          setClickedIndex={setClickedIndex}
          index={index}
          startingIndex={cumulativeStartingIndices[index]}
        />
      ))}
    </Div>
  )
}

const Div = styled.div`
  margin-top: 4rem;
`

export default Timeline
