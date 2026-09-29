import React from "react";
import { Layout, Typography, Button, Card, Divider } from "antd";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeftOutlined,
  SafetyCertificateOutlined,
  EyeOutlined,
  GlobalOutlined,
  UserOutlined,
  MailOutlined,
} from "@ant-design/icons";
import Navbar from "@/features/landing/components/Navbar";
import Footer from "@/features/landing/components/Footer";

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

const PrivacyPage: React.FC = () => {
  const navigate = useNavigate();

  const sections = [
    {
      title: "Information We Collect",
      icon: <UserOutlined className="text-primary text-2xl" />,
      content:
        "We collect personal information such as your name, email address, phone number, date of birth, and health-related data (height, weight, fitness goals) to provide a personalized gym experience.",
    },
    {
      title: "How We Use Data",
      icon: <EyeOutlined className="text-primary text-2xl" />,
      content:
        "Your data is used to manage your membership, track your fitness progress, send important announcements, and improve our services. We do not sell your personal data to third parties.",
    },
    {
      title: "Cookies & Tracking",
      icon: <GlobalOutlined className="text-primary text-2xl" />,
      content:
        "Our website uses cookies to enhance your browsing experience, remember your preferences, and analyze site traffic.",
    },
    {
      title: "Data Protection",
      icon: <SafetyCertificateOutlined className="text-primary text-2xl" />,
      content:
        "We implement industry-standard security measures to protect your data from unauthorized access, alteration, or disclosure.",
    },
    {
      title: "Third-Party Services",
      icon: <GlobalOutlined className="text-primary text-2xl" />,
      content:
        "We may use third-party tools for analytics or payment processing. These providers have their own privacy policies.",
    },
    {
      title: "User Rights",
      icon: <UserOutlined className="text-primary text-2xl" />,
      content:
        "You have the right to access, correct, or delete your personal information. You can manage your profile settings or contact us for assistance.",
    },
  ];

  return (
    <Layout className="min-h-screen bg-background text-white">
      <Navbar />
      <Content className="pt-24 pb-16 px-4 md:px-8">
        <div className="max-w-[1000px] mx-auto">
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/")}
            className="text-gray-400 hover:text-primary mb-8 flex items-center gap-2 p-0 h-auto"
          >
            Back to Home
          </Button>

          <header className="mb-12">
            <Title level={1} className="!text-white !mb-4">
              Privacy <span className="text-primary">Policy</span>
            </Title>
            <Paragraph className="!text-gray-400 text-lg">
              Last updated: February 2026. Your privacy is our priority at
              Dynamic Gym.
            </Paragraph>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sections.map((section, index) => (
              <Card
                key={index}
                className="bg-gray-900/50 border-white/5 backdrop-blur-sm hover:border-primary/30 transition-all duration-300"
                styles={{ body: { padding: "24px" } }}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-xl">
                    {section.icon}
                  </div>
                  <div>
                    <Title level={4} className="!text-white !mt-0 !mb-2">
                      {section.title}
                    </Title>
                    <Paragraph className="!text-gray-400 text-sm leading-relaxed mb-0">
                      {section.content}
                    </Paragraph>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Divider className="border-white/10 my-12" />

          <Card className="bg-primary/5 border-primary/20 rounded-2xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-4">
              <div className="flex items-center gap-4">
                <MailOutlined className="text-primary text-3xl" />
                <div>
                  <Title level={4} className="!text-white !m-0">
                    Contact Information
                  </Title>
                  <Text className="!text-gray-400">
                    Questions about your privacy?
                  </Text>
                </div>
              </div>
              <Button
                type="primary"
                size="large"
                className="bg-primary text-background font-bold rounded-xl h-auto py-3 px-8"
              >
                Contact Privacy Team
              </Button>
            </div>
          </Card>
        </div>
      </Content>
      <Footer />
    </Layout>
  );
};

export default PrivacyPage;
