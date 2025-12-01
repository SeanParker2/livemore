
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface WelcomeEmailProps {
  firstName: string;
}

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const WelcomeEmail = ({ firstName }: WelcomeEmailProps) => (
  <Html>
    <Head />
    <Preview>感谢订阅！这里是您需要的市场深度分析。</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={logo}>Livemore</Text>
        <Heading style={h1}>欢迎加入 Livemore, {firstName}!</Heading>
        <Text style={paragraph}>
          很高兴能与您相遇。在这里，我们拒绝噪音，只关注未来 5-10
          年的确定性机会。
        </Text>
        <Text style={paragraph}>
          作为订阅者，您将每周收到我们的宏观市场简报。如果您是 Pro
          会员，还将解锁深度研报。
        </Text>
        <Section style={btnContainer}>
          <Button style={button} href={baseUrl}>
            开始阅读
          </Button>
        </Section>
        <Hr style={hr} />
        <Text style={footer}>如果您没有订阅过，请忽略此邮件。</Text>
      </Container>
    </Body>
  </Html>
);

export default WelcomeEmail;

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
};

const logo = {
  fontSize: "28px",
  fontWeight: "bold",
  fontFamily: "serif",
};

const h1 = {
  color: "#1d1c1d",
  fontSize: "32px",
  fontWeight: "700",
  margin: "30px 0",
  padding: "0",
  lineHeight: "42px",
};

const paragraph = {
  color: "#5f5f5f",
  fontSize: "16px",
  lineHeight: "24px",
  textAlign: "left" as const,
};

const btnContainer = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const button = {
  backgroundColor: "#000000",
  color: "#ffffff",
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px 24px",
  borderRadius: "6px",
};

const hr = {
  borderColor: "#cccccc",
  margin: "20px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
};
