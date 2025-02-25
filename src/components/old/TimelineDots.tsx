import styled from "styled-components"

const DotsContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1rem;
  gap: 1rem;
`

const Dot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${(props) => (props.$active ? "black" : "black")};
  cursor: pointer;

  &:hover {
    background-color: black;
  }
`

const TimelineDots = ({ timelineData, activeIndex, onDotClick }) => {
  return (
    <DotsContainer>
      {timelineData.map((_, index) => (
        <Dot key={index} $active={index === activeIndex} onClick={() => onDotClick(index)} />
      ))}
    </DotsContainer>
  )
}

export default TimelineDots
