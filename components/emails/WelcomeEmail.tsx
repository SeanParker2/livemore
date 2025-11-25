import { 
  Body, 
  Container, 
  Head, 
  Html, 
  Preview, 
  Text, 
  Heading, 
  Font 
} from '@react-email/components';

interface WelcomeEmailProps {
  name: string;
}

export const WelcomeEmail = ({ name }: WelcomeEmailProps) => (
  <Html>
    <Head>
      <Font 
        fontFamily="Libre Baskerville"
        fallbackFontFamily="serif"
        webFont={{
          url: 'https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@700&display=swap',
          format: 'woff2',
        }}
        fontWeight={700}
        fontStyle="normal"
      />
    </Head>
    <Preview>Welcome to Livemore</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Livemore</Heading>
        <Text style={text}>Hello {name},</Text>
        <Text style={text}>
          Thank you for subscribing to Livemore. We're excited to have you on board.
          You'll now receive our latest analysis and insights directly in your inbox.
        </Text>
        <Text style={text}>
          Best,
          <br />
          The Livemore Team
        </Text>
      </Container>
    </Body>
  </Html>
);

export default WelcomeEmail;

const main = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  fontFamily: 'sans-serif',
};

const container = {
  padding: '40px',
  margin: '0 auto',
  backgroundColor: '#ffffff',
};

const h1 = {
  fontFamily: '"Libre Baskerville", serif',
  color: '#1a1a1a',
  fontSize: '36px',
  fontWeight: '700',
  margin: '30px 0',
  padding: '0',
  lineHeight: '42px',
};

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '24px',
};