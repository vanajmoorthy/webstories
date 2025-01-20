import React, { useState } from "react"
import styled from "styled-components"
import ImageCardFan from "./ImageCardFan"

const breakpoint = "820px"

const colors = ["#f7d7d3", "#ffe3df", "#f6cec7"]

const TimelineSection = ({ section, reverse, onImageClick, clickedIndex, setClickedIndex, index, startingIndex }) => {
  const backgroundColor = colors[index % colors.length]
  return (
    <Container $backgroundColor={backgroundColor}>
      <Section className={reverse ? "reversed" : ""}>
        <ImageCardFan
          pictures={section.pictures}
          date={section.date}
          onImageClick={onImageClick}
          clickedIndex={clickedIndex}
          setClickedIndex={setClickedIndex}
          cardIndex={index}
          description={section.description}
          startingIndex={startingIndex}
        />
        <Description>{section.description}</Description>
      </Section>
    </Container>
  )
}

const Section = styled.div`
  display: flex;
  max-width: 800px;
  width: calc(100vw - 10rem);
  align-items: center;
  padding: 1rem 2rem;
  height: 485px;
  justify-content: space-between;

  &.reversed {
    flex-direction: row-reverse;
  }
  @media (max-width: ${breakpoint}) {
    flex-direction: column;
    justify-content: center;
    height: auto;
    width: calc(100vw - 5rem);
    padding: 4rem 0rem 4rem 0rem;
    &.reversed {
      flex-direction: column;
    }
  }
`

const Container = styled.div`
  display: flex;
  justify-content: center;
  background-color: ${({ $backgroundColor }) => $backgroundColor};
`

const Description = styled.p`
  margin: 0 2rem;
  font-size: 1.2rem;
  @media (max-width: ${breakpoint}) {
    margin: 0rem;
    text-align: center;
  }
`

export default TimelineSection
