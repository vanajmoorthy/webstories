import styled from "styled-components"

const FooterContainer = styled.footer`
  background-color: #fab5aa; /* Adjust the color as needed */
  text-align: center;
  padding: 1.5rem 1rem;
  color: white;
  font-size: 1.2rem;
`

const ColorDiv = styled.div`
  background-color: ${(props) => props.color};
  height: 0.5rem;
  transition: height 0.5s cubic-bezier(0.25, 0.1, 0.25, 1);
`
const StyledHeader = styled.h1`
  font-family: "Bonbance";
  font-size: 1rem;
  color: black;
  text-shadow:
    1px 1px 0px rgb(255 227 227 / 90%),
    2px 2px 0px rgb(248 218 218 / 90%),
    3px 3px 0px rgb(243 195 195 / 90%);
  font-weight: 500;
  cursor: pointer;
`

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  return (
    <>
      <ColorDiv color="#f7d7d3" />
      <ColorDiv color="#f6cec7" />
      <ColorDiv color="#f9c1b8" />

      <FooterContainer>
        <StyledHeader onClick={scrollToTop}>Made with ❤️ by Vanaj Moorthy</StyledHeader>
      </FooterContainer>
    </>
  )
}

export default Footer
