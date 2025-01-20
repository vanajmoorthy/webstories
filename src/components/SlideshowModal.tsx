import { useState, useEffect, useRef } from "react"
import styled from "styled-components"
import { motion } from "framer-motion"

const breakpoint = "820px"

const SlideshowModal = ({ pictures, currentIndex, onClose, setCurrentIndex, description }) => {
  const [showModal, setShowModal] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [isPlaying, setIsPlaying] = useState(true)
  const [direction, setDirection] = useState(0)
  const [progress, setProgress] = useState(0)

  const videoRef = useRef(null)

  useEffect(() => {
    setShowModal(true)
  }, [])

  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play()
      } else {
        videoRef.current.pause()
      }
    }
  }, [isPlaying, currentIndex])

  const goToNext = () => {
    setDirection(1)
    setCurrentIndex((prevIndex) => (prevIndex + 1) % pictures.length)
  }

  const goToPrev = () => {
    setDirection(-1)
    setCurrentIndex((prevIndex) => (prevIndex - 1 + pictures.length) % pictures.length)
  }

  const isVideo = (file) => /\.(mp4|webm|ogg|mov|mp4)$/i.test(file)

  const togglePlayPause = () => {
    setIsPlaying((prevState) => !prevState)
  }

  const toggleMute = () => {
    setIsMuted((prevState) => !prevState)
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100
      setProgress(progress)
    }
  }

  const handleScrub = (event) => {
    const scrubberWidth = event.target.offsetWidth
    const clickX = event.nativeEvent.offsetX
    const newTime = (clickX / scrubberWidth) * videoRef.current.duration
    videoRef.current.currentTime = newTime
    setProgress((clickX / scrubberWidth) * 100)
  }

  return (
    <ModalContainer>
      <ModalContent initial={{ opacity: 0 }} animate={{ opacity: showModal ? 1 : 0 }} transition={{ duration: 1 }}>
        <MotionDiv
          key={currentIndex}
          initial={{ x: direction === 1 ? "100%" : "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: direction === 1 ? "-100%" : "100%" }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 20,
            duration: 2.8,
          }}
        >
          {isVideo(pictures[currentIndex]) ? (
            <>
              <StyledVideo
                ref={videoRef}
                src={pictures[currentIndex]}
                loop
                muted={isMuted}
                playsInline
                onTimeUpdate={handleTimeUpdate}
              />
              <VideoControls>
                <ControlButton onClick={togglePlayPause}>
                  {isPlaying ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                      <path d="M8 7h3v10H8zm5 0h3v10h-3z"></path>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                      <path d="M7 6v12l10-6z"></path>
                    </svg>
                  )}
                </ControlButton>
                <ProgressBarContainer onClick={handleScrub}>
                  <ProgressBarFilled style={{ width: `${progress}%` }} />
                </ProgressBarContainer>
                <ControlButton onClick={toggleMute}>
                  {isMuted ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                      <path d="m7.727 6.313-4.02-4.02-1.414 1.414 18 18 1.414-1.414-2.02-2.02A9.578 9.578 0 0 0 21.999 12c0-4.091-2.472-7.453-5.999-9v2c2.387 1.386 3.999 4.047 3.999 7a8.13 8.13 0 0 1-1.671 4.914l-1.286-1.286C17.644 14.536 18 13.19 18 12c0-1.771-.775-3.9-2-5v7.586l-2-2V2.132L7.727 6.313zM4 17h2.697L14 21.868v-3.747L3.102 7.223A1.995 1.995 0 0 0 2 9v6c0 1.103.897 2 2 2z"></path>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                      <path d="M16 21c3.527-1.547 5.999-4.909 5.999-9S19.527 4.547 16 3v2c2.387 1.386 3.999 4.047 3.999 7S18.387 17.614 16 19v2z"></path>
                      <path d="M16 7v10c1.225-1.1 2-3.229 2-5s-.775-3.9-2-5zM4 17h2.697L14 21.868V2.132L6.697 7H4c-1.103 0-2 .897-2 2v6c0 1.103.897 2 2 2z"></path>
                    </svg>
                  )}
                </ControlButton>
              </VideoControls>

              {description && <Description>{description[currentIndex]}</Description>}
            </>
          ) : (
            <>
              <StyledImage src={pictures[currentIndex]} alt="Slideshow" />

              {description && <Description>{description[currentIndex]}</Description>}
            </>
          )}
        </MotionDiv>

        <ModalControls>
          <CarouselButton onClick={goToPrev}>
            <CarouselSvg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path d="M13.293 6.293 7.586 12l5.707 5.707 1.414-1.414L10.414 12l4.293-4.293z"></path>
            </CarouselSvg>
          </CarouselButton>
          <CloseButton onClick={onClose}>Close</CloseButton>

          <CarouselButton onClick={goToNext}>
            <CarouselSvg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path d="M10.707 17.707 16.414 12l-5.707-5.707-1.414 1.414L13.586 12l-4.293 4.293z"></path>
            </CarouselSvg>
          </CarouselButton>
        </ModalControls>
      </ModalContent>
    </ModalContainer>
  )
}

const ProgressBarContainer = styled.div`
  position: relative;
  width: 100%;
  height: 5px;
  background-color: #fff;
  margin: 0 1rem;
  cursor: pointer;
`

const ProgressBarFilled = styled.div`
  height: 100%;
  background-color: #ff0000;
`

const MotionDiv = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: max-content;
  height: 80dvh;
  margin-bottom: 2rem;

  @media (max-width: ${breakpoint}) {
    margin-top: 1rem;
  }
`

const StyledImage = styled.img`
  height: 60dvh;
  width: 30rem;
  object-fit: cover;
  border-top: 15px solid white;
  border-left: 15px solid white;
  border-right: 15px solid white;
  /* border-radius: 3px; */
  box-shadow: 11px 11px 37px rgba(0, 0, 0, 0.6);

  @media (max-width: ${breakpoint}) {
    width: 80vw;
    height: 42dvh;
  }
`

const StyledVideo = styled.video`
  height: 60dvh;
  width: 30rem;
  object-fit: cover;
  border-top: 15px solid white;
  border-left: 15px solid white;
  border-right: 15px solid white;
  /* border-radius: 3px; */

  @media (max-width: ${breakpoint}) {
    width: 80vw;
    height: 40dvh;
  }
`

const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(3px);
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  z-index: 10;

  @media (max-width: ${breakpoint}) {
    width: 100vw;
    height: 100dvh;
  }
`

const ModalContent = styled(motion.div)`
  padding: 2rem;
  flex-direction: column;
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: ${breakpoint}) {
    justify-content: space-between;
  }
`

const ModalControls = styled.div`
  //position: absolute;
  //top: 50%;
  //left: 50%;
  display: flex;
  justify-content: space-between;
  width: 12rem;
  //transform: translate(-50%, -50%);
  margin-top: 1rem;
  display: flex;
  align-items: center;
  margin-bottom: 2dvh;
`

const VideoControls = styled.div`
  position: relative;
  height: 0;
  /* bottom: 20px; */
  top: -35px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 90%;
`

const CarouselSvg = styled.svg`
  transition: 0.2s ease;
  background: #fab5aa;
  border-radius: 5px;
  width: 40px;
  height: 40px;

  &:hover {
    cursor: pointer;

    background-color: #d2968c;
  }
`

const CarouselButton = styled.button`
  background: none;
  border: none;
`

const ControlButton = styled.button`
  background-color: #fab5aa;
  color: #000;
  border: none;
  margin: 0 0.5rem;
  font-size: 1rem;
  border-radius: 5px;
  cursor: pointer;
  height: 40px;
  width: 55px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.2s ease;

  &:hover {
    background-color: #d2968c;
  }
`

const CloseButton = styled.button`
  background: none;
  border: none;
  transition: 0.2s ease;
  /* height: 28px; */
  width: auto;
  padding: 0.5rem 0.7rem;
  background: #fab5aa;
  border-radius: 5px;
  margin-top: -3px;
  font-size: 20px;
  font-family: "InstrumentBold";
  font-weight: 900;
  color: black;

  &:hover {
    cursor: pointer;
    background-color: #d2968c;
  }
`

const Description = styled.p`
  text-align: center;
  font-size: 1.2rem;
  max-width: 30rem;
  color: black;
  background: #fff;
  padding: 1rem;
`

export default SlideshowModal
