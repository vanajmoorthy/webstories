//import { useEffect, useRef, useState } from "react"
//import styled, { createGlobalStyle } from "styled-components"
//
//import Footer from "../../components/old/Footer"
//import Header from "../../components/old/Header"
//import SlideshowModal from "../../components/old/SlideshowModal"
//import Text from "../../components/old/Text"
//import TimeSince from "../../components/old/TimeSince"
//import Timeline from "../../components/old/Timeline"
//import timelineData from "../../imageData.json"
//
//const GlobalStyle = createGlobalStyle`
//  body.no-scroll {
//    overflow: hidden;
//  }
//`
//
//const descriptions = []
//for (let i = 0; i < timelineData.length; i++) {
//  const row = timelineData[i]
//  for (let j = 0; j < row.pictures.length; j++) {
//    descriptions.push(row.description)
//  }
//}
//
//const HappyBirthday = styled.div`
//  font-size: 1.2rem;
//  max-width: 750px;
//  text-align: center;
//`
//
//const Container = styled.div`
//  display: flex;
//  justify-content: center;
//  margin-top: 2rem;
//  font-family: "InstrumentItalic";
//  padding: 2rem;
//  background-color: #f7d7d3;
//`
//
//function WebstoryPage() {
//  const [isModalOpen, setIsModalOpen] = useState(false)
//  const [currentIndex, setCurrentIndex] = useState(0)
//  const [clickedIndex, setClickedIndex] = useState(null)
//  const [activeIndex, setActiveIndex] = useState(0)
//  const sectionsRef = useRef([])
//
//  useEffect(() => {
//    const observer = new IntersectionObserver(
//      (entries) => {
//        entries.forEach((entry) => {
//          if (entry.isIntersecting) {
//            const index = sectionsRef.current.indexOf(entry.target)
//            setActiveIndex(index)
//          }
//        })
//      },
//      { threshold: 0.5 }
//    )
//
//    sectionsRef.current.forEach((section) => observer.observe(section))
//    return () => observer.disconnect()
//  }, [])
//
//  const handleDotClick = (index) => {
//    sectionsRef.current[index].scrollIntoView({ behavior: "smooth" })
//    setActiveIndex(index)
//  }
//
//  const openModal = (index) => {
//    setCurrentIndex(index)
//    setIsModalOpen(true)
//    document.body.classList.add("no-scroll")
//  }
//
//  const closeModal = () => {
//    setIsModalOpen(false)
//    setClickedIndex(null)
//    document.body.classList.remove("no-scroll")
//  }
//
//  return (
//    <>
//      <GlobalStyle />
//      <Header timelineData={timelineData} activeIndex={activeIndex} onDotClick={handleDotClick} />
//      <TimeSince />
//      <Text />
//      <Timeline
//        onImageClick={openModal}
//        clickedIndex={clickedIndex}
//        setClickedIndex={setClickedIndex}
//        timelineData={timelineData}
//        sectionsRef={sectionsRef}
//        activeIndex={activeIndex}
//        setActiveIndex={setActiveIndex}
//      />
//      {isModalOpen && (
//        <SlideshowModal
//          pictures={timelineData.flatMap((section) => section.pictures)}
//          currentIndex={currentIndex}
//          onClose={closeModal}
//          setCurrentIndex={setCurrentIndex}
//          description={descriptions}
//        />
//      )}
//      <Container>
//        <HappyBirthday>
//          Happy birthday Niamh! My love for you is so large and intense that words will never be able to adequately
//          capture my emotions. You make my life so much happier and brighter with your presence and you are, without a
//          doubt, the most remarkable person I've ever met in my life. You are my soulmate and my best friend, and every
//          day we spend together makes me all the more grateful for you. <br /> <br /> I hope you have the best birthday
//          ever and that today is as special as you are. To many more stories together!
//        </HappyBirthday>
//      </Container>
//      <Footer />
//    </>
//  )
//}
//
//export default WebstoryPage
