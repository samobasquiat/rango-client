import * as React from 'react';
import { IconProps } from './types';
import { styled } from '../../theme';
const Svg = styled('svg', {
  variants: {
   color: {
     primary: {
       fill:'$primary'
     },
     error: {
       fill:'$error'
     },
     warning: {
       fill:'$warning'
     },
     success: {
       fill:'$success'
     },
     black:{
       fill:'$black'
     },
     white:{
       fill:'$white'
     }
   },
 },


});
export const Wallet = React.forwardRef<SVGSVGElement, IconProps>(
  ({ size = 16, color='black', ...props }) => {
    return (
      <Svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
 color={color}

        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M4.51 7.205a3.018 3.018 0 0 0-3.01 3.01v6.73a3.018 3.018 0 0 0 3.01 3.01h11.48a3.018 3.018 0 0 0 3.01-3.01v-.44h-1.15c-1.41 0-2.778-1.03-2.907-2.553a2.758 2.758 0 0 1 .816-2.227 2.743 2.743 0 0 1 1.971-.82H19v-.69a3.018 3.018 0 0 0-3.01-3.01H4.51ZM0 10.215a4.518 4.518 0 0 1 4.51-4.51h11.48a4.518 4.518 0 0 1 4.51 4.51v1.44a.75.75 0 0 1-.75.75h-2.02c-.36 0-.675.14-.903.373l-.013.014c-.266.26-.415.63-.377 1.022v.009c.053.635.664 1.182 1.413 1.182h1.9a.75.75 0 0 1 .75.75v1.19a4.518 4.518 0 0 1-4.51 4.51H4.51A4.518 4.518 0 0 1 0 16.945v-6.73Z"
          
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12.35 2.655a1.15 1.15 0 0 0-1.554-1.079l-7.94 3A2.098 2.098 0 0 0 1.5 6.547v4.569a.75.75 0 1 1-1.5 0v-4.57c0-1.5.922-2.84 2.325-3.371l7.94-3s-.001 0 0 0c1.732-.657 3.585.629 3.585 2.481v3.8a.75.75 0 0 1-1.5 0v-3.8ZM17.729 12.405c-.36 0-.675.14-.903.373l-.013.014c-.266.26-.415.63-.377 1.022v.009c.053.635.664 1.182 1.413 1.182h1.943a.276.276 0 0 0 .267-.27v-2.06a.276.276 0 0 0-.267-.27h-2.063Zm-1.97-.68a2.743 2.743 0 0 1 1.97-.82h2.107a1.777 1.777 0 0 1 1.723 1.77v2.06a1.777 1.777 0 0 1-1.75 1.77h-1.96c-1.41 0-2.778-1.03-2.907-2.553a2.759 2.759 0 0 1 .816-2.227Z"
          
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M4.5 10.705a.75.75 0 0 1 .75-.75h7a.75.75 0 0 1 0 1.5h-7a.75.75 0 0 1-.75-.75Z"
          
        />
      </Svg>
    );
  }
);

export default Wallet;
