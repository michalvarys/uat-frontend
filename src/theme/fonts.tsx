import { Global } from '@emotion/react'

export const fonts = {
  writer: 'iAWriterQuattroS',
}

const fontFaces = `
    @font-face {
      font-family: 'iAWriterQuattroS';
      font-style: normal;
      font-weight: 900;
      font-display: swap;
      src: local('iAWriterQuattroS'), url(/fonts/iAWriterQuattroS-Bold.woff2) format('woff2');
    }

    @font-face {
      font-family: 'iAWriterQuattroS';
      font-style: normal;
      font-weight: 400;
      font-display: swap;
      src: local('iAWriterQuattroS'), url(/fonts/iAWriterQuattroS-Regular.woff2) format('woff2');
    }

    @font-face {
      font-family: 'iAWriterQuattroS';
      font-style: italic;
      font-weight: 900;
      font-display: swap;
      src: local('iAWriterQuattroS'), url(/fonts/iAWriterQuattroS-BoldItalic.woff2) format('woff2');
    }

    @font-face {
      font-family: 'iAWriterQuattroS';
      font-style: italic;
      font-weight: 400;
      font-display: swap;
      src: local('iAWriterQuattroS'), url(/fonts/iAWriterQuattroS-Italic.woff2) format('woff2');
    }  
`

export const Fonts = () => <Global styles={fontFaces} />
