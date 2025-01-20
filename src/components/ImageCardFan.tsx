import { useState } from "react"
import styled from "styled-components"
import { motion } from "framer-motion"

const breakpoint = "820px"

const calculateRotation = (index, total, degree) => {
  const midpoint = Math.floor(total / 2)
  const isEven = total % 2 === 0
  // For even-length lists
  if (isEven) {
    return (index - midpoint + 0.5) * degree // ±5, ±10, etc.
  }
  // For odd-length lists
  else {
    return (index - midpoint) * degree // 0, ±5, ±10, etc.
  }
}

const ImageCardFan = ({ pictures, date, onImageClick, clickedIndex, setClickedIndex, cardIndex, startingIndex }) => {
  const [isHovered, setIsHovered] = useState(false)

  const isVideo = (file) => /\.(mp4|webm|ogg|mov|mp4)$/i.test(file)

  const handleContainerClick = () => {
    setClickedIndex(cardIndex)
    setTimeout(() => {
      onImageClick(startingIndex)
    }, 200)
  }

  const isClicked = clickedIndex === cardIndex

  const getOrdinal = (n) => {
    const suffix = ["th", "st", "nd", "rd"]
    const v = n % 100
    return n + (suffix[(v - 20) % 10] || suffix[v] || suffix[0])
  }

  const formatDateWithOrdinal = (dateString) => {
    // Ensure the date is properly parsed
    const date = new Date(dateString)

    // Validate that the date is valid
    if (isNaN(date.getTime())) {
      throw new Error(`Invalid date: ${dateString}`)
    }

    const options = { month: "long", year: "numeric" }
    const monthAndYear = new Intl.DateTimeFormat("en-GB", options).format(date)
    const day = getOrdinal(date.getDate())
    return `${day} ${monthAndYear.replace(" ", ", ")}`
  }

  return (
    <PictureDateContainer
      total={pictures.length}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
      }}
      onClick={() => {
        handleContainerClick()
      }}
      $isHovered={isHovered}
      $isClicked={isClicked}
    >
      <Pictures total={pictures.length}>
        {pictures.map((media, index) => (
          <>
            {isVideo(media) ? (
              <MotionMedia
                key={`video-${index}`}
                src={media}
                autoPlay
                loop
                muted
                playsInline
                index={index}
                total={pictures.length}
                $isHovered={isHovered}
                $isClicked={isClicked}
              />
            ) : (
              <MotionPicture
                key={`image-${index}`}
                src={media}
                alt={`Memory ${index + 1}`}
                index={index}
                total={pictures.length}
                $isHovered={isHovered}
                $isClicked={isClicked}
              />
            )}
            {index === 0 && (
              <MotionDate
                key={`date-${index}`}
                date={date}
                index={index}
                total={pictures.length}
                $isHovered={isHovered}
                $isClicked={isClicked}
              >
                {formatDateWithOrdinal(date)}
              </MotionDate>
            )}
          </>
        ))}
      </Pictures>
    </PictureDateContainer>
  )
}

const calculateMargin = (total) => {
  if (total === 1) return "20px"
  if (total === 2) return "10px"
  if (total === 3) return "-15px"
  if (total === 4) return "-35px"
  if (total === 5) return "-60px"
  if (total === 6) return "-75px"
  if (total === 7) return "-90px"
  return "-15px"
}

const calculateDateOffset = (total) => {
  if (total === 1) return "-25px"
  if (total === 2) return "-17px"
  if (total === 3) return "-5px"
  if (total === 4) return "2px"
  if (total === 5) return "-10px"
  if (total === 6) return "-12px"
  if (total === 7) return "25px"
}

const calculateMobileDateOffset = (total) => {
  if (total === 1) return "-15px"
  if (total === 2) return "-2px"
  if (total === 3) return "5px"
  if (total === 4) return "10px"
  if (total === 5) return "20px"
  if (total === 6) return "34px"
  if (total === 7) return "40px"
}

const calculatePictureWidth = (total) => {
  if (total === 1) return "360px"
  if (total === 2) return "360px"
  if (total === 3) return "360px"
  if (total === 4) return "360px"
  if (total === 5) return "400px"
  if (total === 6) return "420px"
  if (total === 7) return "360px"
}

const MotionDate = styled(motion.div)`
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
  position: relative;
  top: -15px;
  left: ${({ total }) => calculateDateOffset(total)};
  margin-top: 1rem;
  grid-area: 3/1/3/3;
  justify-self: center;
  transform: rotate(${({ index, total, $isClicked }) => calculateRotation(index, total, $isClicked ? 15 : 4)}deg);
  transform-origin: bottom center;
  transition: transform 0.4s ease;

  @media (max-width: ${breakpoint}) {
    top: -65px;
    left: ${({ total }) => calculateMobileDateOffset(total)};
  }

  ${({ $isHovered, index, total, $isClicked }) =>
    $isHovered &&
    !$isClicked &&
    `
      transform: rotate(${calculateRotation(index, total, 7)}deg);
   `}
`

const PictureDateContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  cursor: pointer;
`

const Pictures = styled(motion.div)`
  height: 420px;
  width: ${({ total }) => calculatePictureWidth(total)};
  display: grid;
  grid-template-columns: 250px 1fr;
  grid-template-rows: 150px 1fr;
  justify-items: baseline;
  z-index: 1;

  @media (max-width: ${breakpoint}) {
    width: 290px;
    margin-left: ${({ total }) => calculateMargin(total)}; // Adjust in media query as well
  }
`
const MotionMedia = styled.video`
  height: 350px;
  width: 280px;
  grid-area: 1 / 1 / 2 / 2;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  margin-left: ${({ index }) => index * 10}px;
  z-index: ${({ index }) => -index}; /* Ensure stacking order */
  transform: rotate(${({ index, total, $isClicked }) => calculateRotation(index, total, $isClicked ? 15 : 4)}deg);
  transform-origin: bottom center;
  object-fit: cover;
  border: 14px solid white;
  border-bottom: 57px solid white;
  transition:
    transform 0.4s ease,
    box-shadow 0.4s ease;
  ${({ $isHovered, index, total, $isClicked }) =>
    $isHovered &&
    !$isClicked &&
    `
      transform: rotate(${calculateRotation(index, total, 7)}deg);
      box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
   `}
  @media (max-width: ${breakpoint}) {
    height: 300px;
    width: 240px;
  }
`
const MotionPicture = styled(motion.img)`
  height: 350px;
  width: 280px;
  grid-area: 1 / 1 / 2 / 2;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  margin-left: ${({ index }) => index * 10}px;
  z-index: ${({ index }) => -index}; /* Ensure stacking order */
  /* Initial rotation (no hover) */
  transform: rotate(${({ index, total, $isClicked }) => calculateRotation(index, total, $isClicked ? 15 : 4)}deg);
  transform-origin: bottom center;
  object-fit: cover;
  border: 14px solid white;
  border-bottom: 57px solid white;
  /* Initial state when parent is not hovered */
  transition:
    transform 0.4s ease,
    box-shadow 0.4s ease;
  ${({ $isHovered, index, total, $isClicked }) =>
    $isHovered &&
    !$isClicked &&
    `
      transform: rotate(${calculateRotation(index, total, 7)}deg);
      box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
   `}
  @media (max-width: ${breakpoint}) {
    height: 300px;
    width: 240px;
  }
`

export default ImageCardFan
