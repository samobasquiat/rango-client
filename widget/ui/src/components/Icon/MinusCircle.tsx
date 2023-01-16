import * as React from 'react';
import { IconProps } from './types';
import { styled } from '../../theme';
const Svg = styled('svg', {
   variants: {
    color: {
      primary: {
        stroke:'$primary'
      },
      error: {
        stroke:'$error'
      },
      warning: {
        stroke:'$warning'
      },
      success: {
        stroke:'$success'
      },
      black:{
        stroke:'$black'
      },
      white:{
        stroke:'$white'
      }
    },
  },


});
export const MinusCircle = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M11.92 22c5.5 0 10-4.5 10-10s-4.5-10-10-10-10 4.5-10 10 4.5 10 10 10ZM7.92 12h8"
          
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    );
  }
);

export default MinusCircle;
