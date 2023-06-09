import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const config = {
  runtime: "edge",
};

export default function handler(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // ?title=<title>
    const hasHandle = searchParams.has("handle");
    const handle = hasHandle
      ? searchParams.get("handle")?.slice(0, 100)
      : "My default title";

    return new ImageResponse(
      (
        <div
          style={{
            backgroundColor: "black",
            backgroundSize: "150px 150px",
            height: "100%",
            width: "100%",
            display: "flex",
            textAlign: "center",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            flexWrap: "nowrap",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              justifyItems: "center",
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="68" height="68" viewBox="0 0 68 68" fill="none">
<g clip-path="url(#clip0_119_41)" filter="url(#filter0_d_119_41)">
<g filter="url(#filter1_d_119_41)">
<path d="M34.0065 39.0155C32.9714 36.1803 30.755 33.9663 27.9904 32.9987C29.3639 32.4801 30.6108 31.6759 31.6481 30.6386C32.6854 29.6013 33.489 28.3548 34.0087 26.9819C34.7686 29.6101 37.1904 31.7544 40.027 32.9987C38.6295 33.4738 37.3607 34.2626 36.3191 35.3065C35.2753 36.3503 34.4869 37.6186 34.0109 39.0155" fill="white"/>
</g>
<g filter="url(#filter2_d_119_41)">
<path d="M17.5565 16.5569C19.2183 14.8942 19.4979 12.4796 18.1811 11.1612C16.8643 9.84279 14.4491 10.1239 12.7873 11.7845C11.1255 13.4472 10.8459 15.8618 12.1627 17.1802C13.4795 18.4986 15.8947 18.2175 17.5565 16.5569Z" fill="white"/>
</g>
<g filter="url(#filter3_d_119_41)">
<path d="M55.2127 54.2136C56.8745 52.5509 57.154 50.1364 55.8372 48.8179C54.5204 47.4995 52.1052 47.7806 50.4434 49.4412C48.7816 51.1039 48.5021 53.5185 49.8189 54.8369C51.1356 56.1531 53.5508 55.8742 55.2127 54.2136Z" fill="white"/>
</g>
<g filter="url(#filter4_d_119_41)">
<path d="M26.6321 25.6331C28.984 23.2818 29.3246 19.8103 27.3942 17.8795C25.4638 15.9487 21.9917 16.2909 19.642 18.6422C17.2901 20.9936 16.9495 24.4651 18.8799 26.3958C20.8103 28.3266 24.2824 27.9845 26.6321 25.6331Z" fill="white"/>
</g>
<g filter="url(#filter5_d_119_41)">
<path d="M48.3515 47.3489C50.7033 44.9976 51.044 41.5261 49.1136 39.5953C47.1832 37.6646 43.7132 38.0067 41.3614 40.3581C39.0095 42.7094 38.6688 46.1809 40.5993 48.1117C42.5297 50.0424 46.0018 49.7003 48.3515 47.3489Z" fill="white"/>
</g>
<g filter="url(#filter6_d_119_41)">
<path d="M55.8372 17.1823C57.154 15.8661 56.8745 13.4493 55.2127 11.7866C53.5508 10.1239 51.1356 9.84494 49.8189 11.1634C48.5021 12.4818 48.7816 14.8963 50.4434 16.5591C52.1052 18.2218 54.5204 18.5007 55.8372 17.1823Z" fill="white"/>
</g>
<g filter="url(#filter7_d_119_41)">
<path d="M18.1811 54.8366C19.4979 53.5182 19.2183 51.1036 17.5565 49.4409C15.8947 47.7782 13.4795 47.4992 12.1627 48.8177C10.8459 50.1361 11.1255 52.5506 12.7873 54.2134C14.4491 55.8761 16.8643 56.155 18.1811 54.8366Z" fill="white"/>
</g>
<g filter="url(#filter8_d_119_41)">
<path d="M49.1179 26.3958C51.0483 24.4651 50.7076 20.9936 48.3557 18.6422C46.0039 16.2909 42.5339 15.9487 40.6035 17.8795C38.6731 19.8103 39.0138 23.2818 41.3656 25.6331C43.7175 27.9845 47.1874 28.3266 49.1179 26.3958Z" fill="white"/>
</g>
<g filter="url(#filter9_d_119_41)">
<path d="M27.403 48.1117C29.3334 46.1809 28.9928 42.7094 26.6409 40.3581C24.289 38.0067 20.8191 37.6646 18.8887 39.5953C16.9583 41.5261 17.2989 44.9976 19.6508 47.3489C22.0027 49.7003 25.4726 50.0424 27.403 48.1117Z" fill="white"/>
</g>
<g filter="url(#filter10_d_119_41)">
<path d="M34 9.74681C36.3497 9.74681 38.2561 8.23663 38.2561 6.37341C38.2561 4.51019 36.3497 3 34 3C31.6503 3 29.7439 4.51019 29.7439 6.37341C29.7439 8.23663 31.6503 9.74681 34 9.74681Z" fill="white"/>
</g>
<g filter="url(#filter11_d_119_41)">
<path d="M34 63.0002C36.3497 63.0002 38.2561 61.49 38.2561 59.6268C38.2561 57.7636 36.3497 56.2534 34 56.2534C31.6503 56.2534 29.7439 57.7636 29.7439 59.6268C29.7439 61.49 31.6503 63.0002 34 63.0002Z" fill="white"/>
</g>
<g filter="url(#filter12_d_119_41)">
<path d="M60.6262 37.2551C62.4889 37.2551 64 35.3505 64 32.9991C64 30.6478 62.4889 28.7432 60.6262 28.7432C58.7635 28.7432 57.2523 30.6478 57.2523 32.9991C57.2523 35.3505 58.7635 37.2551 60.6262 37.2551Z" fill="white"/>
</g>
<g filter="url(#filter13_d_119_41)">
<path d="M7.37385 37.2551C9.23657 37.2551 10.7477 35.3505 10.7477 32.9991C10.7477 30.6478 9.23657 28.7432 7.37385 28.7432C5.51114 28.7432 4 30.65 4 33.0013C4 35.3527 5.51114 37.2573 7.37385 37.2573" fill="white"/>
</g>
</g>
<defs>
<filter id="filter0_d_119_41" x="0" y="0" width="68" height="68" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="1"/>
<feGaussianBlur stdDeviation="2"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_119_41"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_119_41" result="shape"/>
</filter>
<filter id="filter1_d_119_41" x="23.9904" y="23.9819" width="20.0367" height="20.0337" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="1"/>
<feGaussianBlur stdDeviation="2"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_119_41"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_119_41" result="shape"/>
</filter>
<filter id="filter2_d_119_41" x="7.3324" y="7.33008" width="15.679" height="15.6812" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="1"/>
<feGaussianBlur stdDeviation="2"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_119_41"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_119_41" result="shape"/>
</filter>
<filter id="filter3_d_119_41" x="44.9885" y="44.9868" width="15.6791" height="15.6802" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="1"/>
<feGaussianBlur stdDeviation="2"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_119_41"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_119_41" result="shape"/>
</filter>
<filter id="filter4_d_119_41" x="13.6285" y="13.6284" width="19.0171" height="19.0186" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="1"/>
<feGaussianBlur stdDeviation="2"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_119_41"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_119_41" result="shape"/>
</filter>
<filter id="filter5_d_119_41" x="35.3479" y="35.3442" width="19.0171" height="19.0186" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="1"/>
<feGaussianBlur stdDeviation="2"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_119_41"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_119_41" result="shape"/>
</filter>
<filter id="filter6_d_119_41" x="44.9885" y="7.33154" width="15.6791" height="15.6826" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="1"/>
<feGaussianBlur stdDeviation="2"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_119_41"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_119_41" result="shape"/>
</filter>
<filter id="filter7_d_119_41" x="7.3324" y="44.9858" width="15.679" height="15.6826" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="1"/>
<feGaussianBlur stdDeviation="2"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_119_41"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_119_41" result="shape"/>
</filter>
<filter id="filter8_d_119_41" x="35.3522" y="13.6284" width="19.0171" height="19.0186" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="1"/>
<feGaussianBlur stdDeviation="2"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_119_41"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_119_41" result="shape"/>
</filter>
<filter id="filter9_d_119_41" x="13.6373" y="35.3442" width="19.0171" height="19.0186" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="1"/>
<feGaussianBlur stdDeviation="2"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_119_41"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_119_41" result="shape"/>
</filter>
<filter id="filter10_d_119_41" x="25.7439" y="0" width="16.5122" height="14.7466" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="1"/>
<feGaussianBlur stdDeviation="2"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_119_41"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_119_41" result="shape"/>
</filter>
<filter id="filter11_d_119_41" x="25.7439" y="53.2534" width="16.5122" height="14.7466" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="1"/>
<feGaussianBlur stdDeviation="2"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_119_41"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_119_41" result="shape"/>
</filter>
<filter id="filter12_d_119_41" x="53.2523" y="25.7432" width="14.7477" height="16.5117" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="1"/>
<feGaussianBlur stdDeviation="2"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_119_41"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_119_41" result="shape"/>
</filter>
<filter id="filter13_d_119_41" x="0" y="25.7432" width="14.7477" height="16.5142" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="1"/>
<feGaussianBlur stdDeviation="2"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_119_41"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_119_41" result="shape"/>
</filter>
<clipPath id="clip0_119_41">
<rect width="60" height="60" fill="white" transform="translate(4 3)"/>
</clipPath>
</defs>
</svg>
          </div>
          <div
            style={{
              fontSize: 60,
              fontStyle: "normal",
              letterSpacing: "-0.025em",
              color: "white",
              marginTop: 30,
              padding: "0 120px",
              lineHeight: 1.4,
              whiteSpace: "pre-wrap",
            }}
          >
            {handle}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
