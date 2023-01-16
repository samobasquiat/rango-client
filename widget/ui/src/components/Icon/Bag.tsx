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
export const Bag = React.forwardRef<SVGSVGElement, IconProps>(
  ({ size = 16, color='black', ...props }) => {
    return (
      <Svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        color={color}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <g clipPath="url(#a)"  strokeWidth={1.5}>
          <path d="M9.333 9.333V4.8a.8.8 0 0 1 .8-.8h11.734a.8.8 0 0 1 .8.8v4.533M13.333 4v5.333M16 4v5.333m9.333 17.334H6.667A2.667 2.667 0 0 1 4 24V12a2.667 2.667 0 0 1 2.667-2.667h18.666A2.667 2.667 0 0 1 28 12v12a2.667 2.667 0 0 1-2.667 2.667Z" />
          <path
            d="M22 18.666a.667.667 0 1 1 0-1.334.667.667 0 0 1 0 1.334Z"
            fill="#10150F"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
        <defs>
          <clipPath id="a">
            <path fill="#fff" d="M0 0h32v32H0z" />
          </clipPath>
        </defs>
      </Svg>
    );
  }
);

export default Bag;
