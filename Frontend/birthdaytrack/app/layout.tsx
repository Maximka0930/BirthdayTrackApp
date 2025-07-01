import { Flex, Layout, Menu } from "antd";
import { Color } from "antd/es/color-picker";
import { Content, Footer, Header } from "antd/es/layout/layout";
import Link from "next/link";

const items = [
  { key: "home", label: <Link href={"/"}>Главная</Link> },
  { key: "calendar", label: <Link href={"/calendar"}>Календарь</Link> },
]

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ margin: 0}}>
        <Layout style={{ minHeight: '100vh',backgroundColor: "white" }}>
          <Header>
            <Menu
              theme="dark" mode="horizontal" items={items}
              style={{ flex: 1, padding: 0, maxWidth: '1200px', margin: '0 auto', width: '100%'}}/>
          </Header>
          <Content style={{width: '60%',margin: '0 auto'}}>{children}</Content>
          <Footer style={{textAlign: "center",width: '100%', margin: '0 auto'}}>
            Birthday track 2025 Created By Maxim Lapshin
          </Footer>
        </Layout>
      </body>
    </html>
  );
}
