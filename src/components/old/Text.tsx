import styled from "styled-components"

const P = styled.p`
  font-family: "Instrument";
  text-align: center;
  font-size: 1.7rem;
  font-weight: 500;
  max-width: 720px;
`

const Div = styled.div`
  margin-top: 3rem;
  display: flex;
  justify-content: center;
  padding: 1rem;
`
const Title = styled.span`
  font-family: "Bonbance";
  text-shadow:
    2px 2px 0px rgb(245 245 245 / 90%),
    3px 3px 0px rgb(248 218 218 / 90%),
    4px 4px 0px rgb(243 195 195 / 90%);
`

const Text = () => (
  <Div>
    <P>
      This website is an ode to <Title>The World&apos;s Greatest Love Story™</Title> – our story, and a celebration of
      all the memories we&apos;ve made together. Falling in love with you has undoubtedly been the greatest adventure of
      my life, You&apos;re my partner in life, my favourite person in the world, and my ride-or-die best friend.
    </P>
  </Div>
)

export default Text
