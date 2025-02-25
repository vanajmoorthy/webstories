import { useEffect, useState } from "react"
import styled from "styled-components"

const Div = styled.div`
  background-color: #fab5aa;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  text-align: center;
  height: ${(props) => props.$headerHeight}dvh;
  transition: height 0.5s cubic-bezier(0.25, 0.1, 0.25, 1);
`

const StyledHeader = styled.h1`
  font-family: "Bonbance";
  font-size: ${(props) => props.$fontSize}rem;
  text-shadow:
    3px 3px 0px rgb(255 227 227 / 90%),
    7px 7px 0px rgb(248 218 218 / 90%),
    10px 10px 0px rgb(243 195 195 / 90%);
  transition: font-size 0.5s cubic-bezier(0.25, 0.1, 0.25, 1);
  font-weight: 500;
`
const ColorDiv = styled.div`
  background-color: ${(props) => props.color};
  height: ${(props) => props.$divHeight}rem;
  transition: height 0.5s cubic-bezier(0.25, 0.1, 0.25, 1);
`

const Container = styled.div`
  position: fixed;
  width: 100%;
  z-index: 2;
`

const Header = () => {
  const initialHeight = () => {
    const viewportHeight = window.innerHeight
    const reducedHeight = viewportHeight - 8 * 16 // 8rem = 8 * 16px
    return (reducedHeight / viewportHeight) * 100
  }
  const [headerHeight, setHeaderHeight] = useState(initialHeight())
  const [fontSize, setFontSize] = useState(4)
  const [colorDivHeight, setColorDivHeight] = useState(2)

  useEffect(() => {
    const handleScroll = () => {
      const scrollPercentage = Math.min(1, window.scrollY / 80)

      const newHeight = 100 - scrollPercentage * 97
      const newFontSize = 4 - scrollPercentage * 3
      const newColorDivHeight = 2 - scrollPercentage * 1.5

      setHeaderHeight(newHeight)
      setFontSize(newFontSize)
      setColorDivHeight(newColorDivHeight)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <Container>
      <Div $headerHeight={headerHeight}>
        <StyledHeader $fontSize={fontSize} className="custom-button">
          The World&apos;s Greatest Love Story™
        </StyledHeader>
      </Div>
      <ColorDiv color="#f9c1b8" $divHeight={colorDivHeight} />
      <ColorDiv color="#f6cec7" $divHeight={colorDivHeight} />
      <ColorDiv color="#f7d7d3" $divHeight={colorDivHeight} />
    </Container>
  )
}

export default Header
