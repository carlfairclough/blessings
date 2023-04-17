import "../styles/globals.css";
import type { AppProps } from "next/app";
import React from "react";
import "@rainbow-me/rainbowkit/styles.css";
import {
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { mainnet } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { ChakraProvider, Container, ThemeConfig } from "@chakra-ui/react";
import { extendTheme } from "@chakra-ui/react";
import { Analytics } from "@vercel/analytics/react";
import Nav from "@/components/nav";
import NextNProgress from "nextjs-progressbar";
import "../utils/swaggerDark.css";

const { chains, provider } = configureChains(
  [mainnet],
  [
    alchemyProvider({ apiKey: process.env.ALCHEMY_ID as string }),
    // publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "LDFs World",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

// 2. Add your color mode config
const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};
const theme = extendTheme({ config });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider chains={chains} theme={darkTheme()}>
          <NextNProgress />
          <Container maxW="container.xl">
            <Nav />
          </Container>
          <Component {...pageProps} />
        </RainbowKitProvider>
      </WagmiConfig>
      <Analytics />
    </ChakraProvider>
  );
}
