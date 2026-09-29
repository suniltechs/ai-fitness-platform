import React from "react";
import { Layout, Typography, Button, Divider } from "antd";
import { useNavigate } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import Navbar from "@/features/landing/components/Navbar";
import Footer from "@/features/landing/components/Footer";

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

const TermsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Layout className="min-h-screen bg-background text-white selection:bg-primary selection:text-background">
      <Navbar />
      <Content className="pt-24 pb-16 px-4 md:px-8">
        <div className="max-w-[900px] mx-auto bg-gray-900/50 backdrop-blur-md border border-white/5 rounded-3xl p-8 md:p-12 shadow-2xl">
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/")}
            className="text-gray-400 hover:text-primary mb-8 flex items-center gap-2 p-0 h-auto"
          >
            Back to Home
          </Button>

          <Typography className="terms-content">
            <Title level={1} className="!text-white !mb-8">
              Terms & <span className="text-primary">Conditions</span>
            </Title>

            <Paragraph className="!text-gray-400 text-lg leading-relaxed mb-12">
              Welcome to{" "}
              <Text className="!text-primary font-bold">Dynamic Gym</Text>. By
              accessing our facilities or using our services, you agree to
              comply with and be bound by the following terms and conditions.
            </Paragraph>

            <Divider className="border-white/10" />

            <section className="mb-10">
              <Title level={3} className="!text-white mb-4">
                1. Introduction
              </Title>
              <Paragraph className="!text-gray-400 leading-relaxed">
                These terms govern your membership and use of the Dynamic Gym
                premises, equipment, and digital platforms. We reserve the right
                to update these terms at any time without prior notice.
              </Paragraph>
            </section>

            <section className="mb-10">
              <Title level={3} className="!text-white mb-4">
                2. Membership Rules
              </Title>
              <Paragraph className="!text-gray-400 leading-relaxed">
                <ul className="list-disc pl-6 space-y-2">
                  <li className="!text-gray-400">
                    Members must be at least 16 years of age.
                  </li>
                  <li className="!text-gray-400">
                    Proper athletic attire and closed-toe shoes are required at
                    all times.
                  </li>
                  <li className="!text-gray-400">
                    Membership cards/IDs are non-transferable and must be
                    presented upon entry.
                  </li>
                  <li className="!text-gray-400">
                    Abusive behavior towards staff or other members will result
                    in immediate termination of membership.
                  </li>
                </ul>
              </Paragraph>
            </section>

            <section className="mb-10">
              <Title level={3} className="!text-white mb-4">
                3. Payments & Fees
              </Title>
              <Paragraph className="!text-gray-400 leading-relaxed">
                Membership fees are billed monthly or annually as per your
                selection. All payments are non-refundable. Late payments may
                incur a penalty fee and temporary suspension of access.
              </Paragraph>
            </section>

            <section className="mb-10">
              <Title level={3} className="!text-white mb-4">
                4. User Responsibilities
              </Title>
              <Paragraph className="!text-gray-400 leading-relaxed">
                Members are responsible for their own safety and must use
                equipment as intended. Please wipe down machines after use and
                return weights to their racks.
              </Paragraph>
            </section>

            <section className="mb-10">
              <Title level={3} className="!text-white mb-4">
                5. Cancellation Policy
              </Title>
              <Paragraph className="!text-gray-400 leading-relaxed">
                Cancellations must be requested at least 30 days in advance via
                the member portal or in person. No refunds will be provided for
                partial months.
              </Paragraph>
            </section>

            <section className="mb-10">
              <Title level={3} className="!text-white mb-4">
                6. Liability Disclaimer
              </Title>
              <Paragraph className="!text-gray-400 leading-relaxed italic">
                Dynamic Gym is not liable for any injuries sustained on the
                premises or through the use of our equipment. Members exercise
                at their own risk.
              </Paragraph>
            </section>

            <section className="mb-10">
              <Title level={3} className="!text-white mb-4">
                7. Data Usage
              </Title>
              <Paragraph className="!text-gray-400 leading-relaxed">
                We collect personal data to manage your membership and provide
                tailored fitness advice. Please refer to our Privacy Policy for
                more details.
              </Paragraph>
            </section>
          </Typography>
        </div>
      </Content>
      <Footer />
    </Layout>
  );
};

export default TermsPage;
