import { FC } from "react";
import { useEnsName, Address } from "wagmi";
import styled from "styled-components";
import { Blessing, BlessingProps } from "./blessing";
import { FieldSet, Records } from "airtable";

const StyledBlessings = styled.div({
  padding: 0,
  borderRadius: 32,
  marginTop: 0,
  paddingBottom: 32,
  flex: 1,
  overflowY: "scroll",
  overflowX: 'hidden',
  height: "100%",
  alignSelf: "stretch",
  display: "flex",
  flexDirection: "column-reverse",
  zIndex: 2,
  "::-webkit-scrollbar": {
    display: "none",
  },

  '@media (max-width: 600px)': { 
    borderRadius: 16,
    paddingBottom: 0,
    borderBottomLeftRadius: 0,
    WebkitBorderBottomRightRadius: 0,
  }
});

export interface BlessingsProps {
  blessings: Records<FieldSet> | undefined;
}

export const Blessings: FC<BlessingsProps> = ({ blessings }) => {
  // const b = blessings as Array<any>
  const b = blessings?.map(blessing => blessing)
  b?.reverse()
  return (
    <StyledBlessings>
      {b?.map((blessing, i) => (
        <Blessing key={i} {...blessing._rawJson.fields} />
      ))}
    </StyledBlessings>
  );
};