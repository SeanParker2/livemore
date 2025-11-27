
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
  Link,
} from "@react-email/components";
import * as React from "react";

interface NewPostEmailProps {
  postTitle: string;
  postExcerpt: string;
  postUrl: string;
  isPremium: boolean;
}

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const NewPostEmail = ({ postTitle, postExcerpt, postUrl, isPremium }: NewPostEmailProps) => (
  <Html>
    <Head />
    <Preview>{postTitle}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={logo}>Livemore 最新研报</Text>
        <Heading style={h1}>{postTitle}</Heading>
        <Text style={paragraph}>{postExcerpt}</Text>
        <Section style={btnContainer}>
          <Button style={button} href={postUrl}>
            {isPremium ? "解锁全文 (会员专享)" : "阅读全文"}
          </Button>
        </Section>
        <Hr style={hr} />
        <Text style={footer}>
          不想收到此类邮件？{" "}
          <Link href={`${baseUrl}/unsubscribe`} style={link}>
            取消订阅
          </Link>
        </Text>
      </Container>
    </Body>
  </Html>
);

export default NewPostEmail;

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
  fontSize: "14px",
  color: "#5f5f5f",
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

const link = {
  color: "#8898aa",
  textDecoration: "underline",
};
