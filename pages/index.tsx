import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "./components/navbar";
import Sidebar from "./components/sidebar";
import { Flex, Text } from "@chakra-ui/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  return (
    <>
      <Navbar />
      <Flex>
        <Sidebar />
      </Flex>

    </>
  );
}
