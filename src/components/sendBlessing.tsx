import { ConnectButton } from "@rainbow-me/rainbowkit";
import { FC, useEffect, useState } from "react";
import styled from "styled-components";
import { useAccount } from "wagmi";

const StyledSendBlessing = styled.section({
  padding: 24,
  background: "rgba(255,255,255,0.15)",
  borderRadius: 24,
  display: "block",
  MarginBottom: 16,
  zIndex: 9999,
  '@media (max-width: 600px)': {
    marginBottom: 0,
    borderRadius: 0,
  }
});

interface SendBlessingProps {
  sendBlessing: () => void;
  setBlessing: (blessing: string) => void;
  blessing: string;
  isLoading: boolean;
}

const StyledInput = styled.textarea({
  borderRadius: 16,
  outline: "none",
  appearance: "none",
  border: "1px solid pink",
  fontSize: 16,
  height: "120px",
  padding: "1em",
  width: "100%",
  display: "block",
  position: "relative",

  '@media (max-width: 600px)': {
    height: 200
  }
});
const StyledSendArea = styled.div({
  position: "absolute",
  bottom: 48,
  left: 48,
  right: 48,
  display: "flex",
  justifyContent: 'space-between',
  '@media (max-width: 600px)': {
    flexDirection: 'column',
    bottom: 32,
    left: 32,
    right: 32,
    display: "flex",
  }
});

const StyledSend = styled.button({
  appearance: "none",
  outline: "none",
  borderRadius: 8,
  padding: "8px 24px",
  color: "black",
  background: "pink",
  fontSize: 16,
  '@media (max-width: 600px)': {
    marginTop: 8
  }
});

const StyledConnectArea = styled.div({
  height: 120,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  '@media (max-width: 600px)': {
    height: 200
  }
});

const ConnectArea: FC = () => (
  <StyledConnectArea>
    <ConnectButton />
  </StyledConnectArea>
);

export const SendBlessing: FC<SendBlessingProps> = ({
  sendBlessing,
  setBlessing,
  blessing,
  isLoading,
}) => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const { isConnected } = useAccount();
  useEffect(() => {
    setLoaded(true);
  }, []);
  return (
    <StyledSendBlessing>
      {loaded && isConnected ? (
        <>
          <StyledInput
            style={{ display: "block" }}
            value={blessing}
            onChange={(e) => setBlessing(e.target.value)}
          />
          <StyledSendArea>
            <span style={{ fontSize: 14 }}>
              <ConnectButton />
            </span>
            <StyledSend onClick={() => sendBlessing()}>
              {isLoading ? 'Open wallet' : 'Send Blessing'}
            </StyledSend>
          </StyledSendArea>
        </>
      ) : (
        <ConnectArea />
      )}
    </StyledSendBlessing>
  );
};
