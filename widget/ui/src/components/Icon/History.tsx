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
export const History = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M16.767 1.5c-.7.002-1.267.57-1.267 1.26V9h2.67c.63 0 1.07-.196 1.352-.478C19.804 8.24 20 7.8 20 7.17V4.75c0-.89-.363-1.704-.952-2.301a3.27 3.27 0 0 0-2.281-.949ZM14 2.76C14 1.23 15.25 0 16.77 0h.007a4.77 4.77 0 0 1 3.333 1.39l.004.003A4.775 4.775 0 0 1 21.5 4.75v2.42c0 .95-.304 1.8-.917 2.413-.613.613-1.462.917-2.413.917h-3.42a.75.75 0 0 1-.75-.75V2.76Z"
          
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M1.057 1.431C1.862.5 3.097 0 4.75 0h12a.75.75 0 0 1 0 1.5c-.686 0-1.25.564-1.25 1.25v17c0 1.442-1.646 2.256-2.797 1.402l-.002-.002-1.718-1.285a.242.242 0 0 0-.313.025l-1.68 1.68a1.758 1.758 0 0 1-2.48 0l-.002-.001L4.85 19.9a.258.258 0 0 0-.34-.03l-1.707 1.278-.002.001C1.643 22.024 0 21.193 0 19.75v-15c0-1.203.27-2.408 1.057-3.319Zm13.245.069H4.75c-1.346 0-2.112.396-2.557.911C1.73 2.948 1.5 3.743 1.5 4.75v15c0 .216.235.325.397.202l.004-.002 1.709-1.28a1.757 1.757 0 0 1 2.3.17l.002.001L7.57 20.51a.259.259 0 0 0 .36 0l1.68-1.68c.61-.61 1.59-.688 2.283-.158l1.704 1.276c.17.125.403 0 .403-.198v-17c0-.45.109-.875.302-1.25Z"
          
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M4 7.75A.75.75 0 0 1 4.75 7h6a.75.75 0 0 1 0 1.5h-6A.75.75 0 0 1 4 7.75ZM4.75 11.75A.75.75 0 0 1 5.5 11H10a.75.75 0 0 1 0 1.5H5.5a.75.75 0 0 1-.75-.75Z"
          
        />
      </Svg>
    );
  }
);

export default History;
