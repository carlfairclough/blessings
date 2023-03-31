import { FC } from "react";
import { useEnsName, Address } from "wagmi";
import styled from "styled-components";

const StyledBlessing = styled.div({
  padding: 24,
  borderBottom: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 0,
  backgroundColor: "rgba(255,255,255,0.06)",
  "&:hover": {
    transition: 'all 0.25s ease-in-out',
    transform: 'scale(1.01)',
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 8,
  },
});

const StyledInfo = styled.h5({
  fontFamily: 'var(--font-mono)',
  opacity:0.5,
  overflow: 'hidden',
whiteSpace: 'nowrap',
textOverflow: 'ellipsis',
})
const StyledMessage = styled.p({
  fontSize: 18,
  marginBottom: 8,
});

export interface BlessingProps {
  Blessing: string;
  From: Address;
  Signature: string;
}

export const Blessing: FC<BlessingProps> = ({ Blessing, From, Signature }) => {
  const { data: ens } = useEnsName({ address: From });
  const a = ens != null ? ens : From;
  return (
    <StyledBlessing>
      <StyledMessage>{Blessing}</StyledMessage>
      <StyledInfo>From:      {a}</StyledInfo>
      <StyledInfo>Signature: {Signature}</StyledInfo>
    </StyledBlessing>
  );
};
