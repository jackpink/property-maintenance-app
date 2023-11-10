import clsx from "clsx";

type LogoProps = {
  className?: string;
  width?: string;
  height?: string;
  colour?: string;
};

const Logo: React.FC<LogoProps> = ({
  className,
  width = "60px",
  height = "60px",
  colour = "#011627",
}) => {
  return (
    <div className={clsx(className)}>
      <svg
        width={width}
        zoomAndPan="magnify"
        viewBox="0 0 375 374.999991"
        height={height}
        preserveAspectRatio="xMidYMid meet"
        version="1.0"
      >
        <defs>
          <g />
          <clipPath id="908c51955c">
            <path
              d="M 12.53125 107 L 95 107 L 95 189 L 12.53125 189 Z M 12.53125 107 "
              clipRule="nonzero"
            />
          </clipPath>
          <clipPath id="254ea710e6">
            <path
              d="M 272 107 L 362.78125 107 L 362.78125 189 L 272 189 Z M 272 107 "
              clipRule="nonzero"
            />
          </clipPath>
          <clipPath id="48ec22ff2a">
            <path
              d="M 12.53125 190 L 187 190 L 187 271 L 12.53125 271 Z M 12.53125 190 "
              clipRule="nonzero"
            />
          </clipPath>
          <clipPath id="42e5e29170">
            <path
              d="M 187 190 L 362.78125 190 L 362.78125 271 L 187 271 Z M 187 190 "
              clipRule="nonzero"
            />
          </clipPath>
          <clipPath id="d957e39116">
            <path
              d="M 12.53125 22.238281 L 187 22.238281 L 187 104 L 12.53125 104 Z M 12.53125 22.238281 "
              clipRule="nonzero"
            />
          </clipPath>
          <clipPath id="ec371a3f65">
            <path
              d="M 187 22.238281 L 362.78125 22.238281 L 362.78125 104 L 187 104 Z M 187 22.238281 "
              clipRule="nonzero"
            />
          </clipPath>
        </defs>
        <path
          fill="#d8d4d3"
          d="M 268.457031 167.636719 C 268.457031 177.742188 260.269531 185.925781 250.164062 185.925781 L 117.519531 185.925781 C 107.417969 185.925781 99.226562 177.738281 99.226562 167.636719 L 99.226562 128.78125 C 99.226562 118.683594 107.417969 110.496094 117.519531 110.496094 L 250.164062 110.496094 C 260.269531 110.496094 268.457031 118.683594 268.457031 128.78125 Z M 268.457031 167.636719 "
          fill-opacity="0"
          fill-rule="nonzero"
        />
        <path
          fill={colour}
          d="M 250.164062 188.535156 L 117.523438 188.535156 C 105.996094 188.535156 96.617188 179.160156 96.617188 167.640625 L 96.617188 128.78125 C 96.617188 117.261719 105.996094 107.886719 117.523438 107.886719 L 250.164062 107.886719 C 261.691406 107.886719 271.070312 117.261719 271.070312 128.78125 L 271.070312 167.636719 C 271.066406 179.160156 261.691406 188.535156 250.164062 188.535156 Z M 117.519531 113.101562 C 108.871094 113.101562 101.835938 120.136719 101.835938 128.78125 L 101.835938 167.636719 C 101.835938 176.285156 108.871094 183.320312 117.519531 183.320312 L 250.164062 183.320312 C 258.8125 183.320312 265.851562 176.285156 265.851562 167.636719 L 265.851562 128.78125 C 265.851562 120.136719 258.8125 113.101562 250.164062 113.101562 Z M 117.519531 113.101562 "
          fill-opacity="1"
          fill-rule="nonzero"
        />
        <path
          fill="#d8d4d3"
          d="M 73.820312 110.496094 L 15.117188 110.496094 L 15.117188 185.925781 L 73.820312 185.925781 C 83.921875 185.925781 92.113281 177.742188 92.113281 167.640625 L 92.113281 128.78125 C 92.109375 118.683594 83.921875 110.496094 73.820312 110.496094 Z M 73.820312 110.496094 "
          fill-opacity="0"
          fill-rule="nonzero"
        />
        <g clip-path="url(#908c51955c)">
          <path
            fill={colour}
            d="M 73.820312 188.535156 L 15.117188 188.535156 C 13.679688 188.535156 12.511719 187.367188 12.511719 185.925781 L 12.511719 110.496094 C 12.511719 109.054688 13.679688 107.886719 15.117188 107.886719 L 73.820312 107.886719 C 85.34375 107.886719 94.71875 117.261719 94.71875 128.78125 L 94.71875 167.636719 C 94.71875 179.160156 85.34375 188.535156 73.820312 188.535156 Z M 17.726562 183.320312 L 73.820312 183.320312 C 82.46875 183.320312 89.503906 176.285156 89.503906 167.640625 L 89.503906 128.78125 C 89.503906 120.136719 82.46875 113.101562 73.820312 113.101562 L 17.726562 113.101562 Z M 17.726562 183.320312 "
            fill-opacity="1"
            fill-rule="nonzero"
          />
        </g>
        <path
          fill="#d8d4d3"
          d="M 360.195312 110.496094 L 293.367188 110.496094 C 283.261719 110.496094 275.074219 118.683594 275.074219 128.78125 L 275.074219 167.636719 C 275.074219 177.742188 283.261719 185.925781 293.367188 185.925781 L 360.195312 185.925781 Z M 360.195312 110.496094 "
          fill-opacity="0"
          fill-rule="nonzero"
        />
        <g clip-path="url(#254ea710e6)">
          <path
            fill={colour}
            d="M 360.195312 188.535156 L 293.367188 188.535156 C 281.839844 188.535156 272.464844 179.160156 272.464844 167.640625 L 272.464844 128.78125 C 272.464844 117.261719 281.839844 107.886719 293.367188 107.886719 L 360.195312 107.886719 C 361.632812 107.886719 362.800781 109.054688 362.800781 110.496094 L 362.800781 185.925781 C 362.800781 187.367188 361.632812 188.535156 360.195312 188.535156 Z M 293.367188 113.101562 C 284.71875 113.101562 277.679688 120.136719 277.679688 128.78125 L 277.679688 167.636719 C 277.679688 176.285156 284.71875 183.320312 293.367188 183.320312 L 357.585938 183.320312 L 357.585938 113.101562 Z M 293.367188 113.101562 "
            fill-opacity="1"
            fill-rule="nonzero"
          />
        </g>
        <path
          fill="#d8d4d3"
          d="M 184.351562 249.929688 C 184.351562 260.035156 176.160156 268.21875 166.054688 268.21875 L 33.414062 268.21875 C 23.308594 268.21875 15.117188 260.03125 15.117188 249.929688 L 15.117188 211.074219 C 15.117188 200.972656 23.308594 192.785156 33.414062 192.785156 L 166.054688 192.785156 C 176.160156 192.785156 184.351562 200.972656 184.351562 211.074219 Z M 184.351562 249.929688 "
          fill-opacity="0"
          fill-rule="nonzero"
        />
        <g clip-path="url(#48ec22ff2a)">
          <path
            fill={colour}
            d="M 166.058594 270.828125 L 33.414062 270.828125 C 21.886719 270.828125 12.511719 261.453125 12.511719 249.929688 L 12.511719 211.074219 C 12.511719 199.550781 21.886719 190.179688 33.414062 190.179688 L 166.058594 190.179688 C 177.582031 190.179688 186.960938 199.550781 186.960938 211.074219 L 186.960938 249.929688 C 186.957031 261.453125 177.582031 270.828125 166.058594 270.828125 Z M 33.414062 195.394531 C 24.761719 195.394531 17.726562 202.425781 17.726562 211.074219 L 17.726562 249.929688 C 17.726562 258.578125 24.761719 265.613281 33.414062 265.613281 L 166.054688 265.613281 C 174.707031 265.613281 181.742188 258.578125 181.742188 249.929688 L 181.742188 211.074219 C 181.742188 202.425781 174.707031 195.394531 166.054688 195.394531 Z M 33.414062 195.394531 "
            fill-opacity="1"
            fill-rule="nonzero"
          />
        </g>
        <path
          fill="#d8d4d3"
          d="M 359.6875 249.929688 C 359.6875 260.035156 351.492188 268.21875 341.390625 268.21875 L 208.746094 268.21875 C 198.640625 268.21875 190.449219 260.03125 190.449219 249.929688 L 190.449219 211.074219 C 190.449219 200.972656 198.640625 192.785156 208.746094 192.785156 L 341.390625 192.785156 C 351.492188 192.785156 359.6875 200.972656 359.6875 211.074219 Z M 359.6875 249.929688 "
          fill-opacity="0"
          fill-rule="nonzero"
        />
        <g clip-path="url(#42e5e29170)">
          <path
            fill={colour}
            d="M 341.390625 270.828125 L 208.746094 270.828125 C 197.222656 270.828125 187.84375 261.453125 187.84375 249.929688 L 187.84375 211.074219 C 187.84375 199.550781 197.222656 190.179688 208.746094 190.179688 L 341.390625 190.179688 C 352.917969 190.179688 362.296875 199.550781 362.296875 211.074219 L 362.296875 249.929688 C 362.292969 261.453125 352.917969 270.828125 341.390625 270.828125 Z M 208.746094 195.394531 C 200.097656 195.394531 193.0625 202.425781 193.0625 211.074219 L 193.0625 249.929688 C 193.0625 258.578125 200.097656 265.613281 208.746094 265.613281 L 341.390625 265.613281 C 350.039062 265.613281 357.078125 258.578125 357.078125 249.929688 L 357.078125 211.074219 C 357.078125 202.425781 350.039062 195.394531 341.390625 195.394531 Z M 208.746094 195.394531 "
            fill-opacity="1"
            fill-rule="nonzero"
          />
        </g>
        <path
          fill="#d8d4d3"
          d="M 184.351562 82.398438 C 184.351562 92.496094 176.160156 100.6875 166.054688 100.6875 L 33.414062 100.6875 C 23.308594 100.6875 15.117188 92.496094 15.117188 82.398438 L 15.117188 43.539062 C 15.117188 33.441406 23.308594 25.253906 33.414062 25.253906 L 166.054688 25.253906 C 176.160156 25.253906 184.351562 33.441406 184.351562 43.539062 Z M 184.351562 82.398438 "
          fill-opacity="0"
          fill-rule="nonzero"
        />
        <g clip-path="url(#d957e39116)">
          <path
            fill={colour}
            d="M 166.058594 103.296875 L 33.414062 103.296875 C 21.886719 103.296875 12.511719 93.921875 12.511719 82.398438 L 12.511719 43.539062 C 12.511719 32.019531 21.886719 22.648438 33.414062 22.648438 L 166.058594 22.648438 C 177.582031 22.648438 186.960938 32.019531 186.960938 43.539062 L 186.960938 82.398438 C 186.957031 93.921875 177.582031 103.296875 166.058594 103.296875 Z M 33.414062 27.863281 C 24.761719 27.863281 17.726562 34.894531 17.726562 43.539062 L 17.726562 82.398438 C 17.726562 91.046875 24.761719 98.082031 33.414062 98.082031 L 166.054688 98.082031 C 174.707031 98.082031 181.742188 91.046875 181.742188 82.398438 L 181.742188 43.539062 C 181.742188 34.894531 174.707031 27.863281 166.054688 27.863281 Z M 33.414062 27.863281 "
            fill-opacity="1"
            fill-rule="nonzero"
          />
        </g>
        <path
          fill="#d8d4d3"
          d="M 359.6875 82.398438 C 359.6875 92.496094 351.492188 100.6875 341.390625 100.6875 L 208.746094 100.6875 C 198.640625 100.6875 190.449219 92.496094 190.449219 82.398438 L 190.449219 43.539062 C 190.449219 33.441406 198.640625 25.253906 208.746094 25.253906 L 341.390625 25.253906 C 351.492188 25.253906 359.6875 33.441406 359.6875 43.539062 Z M 359.6875 82.398438 "
          fill-opacity="0"
          fill-rule="nonzero"
        />
        <g clip-path="url(#ec371a3f65)">
          <path
            fill={colour}
            d="M 341.390625 103.296875 L 208.746094 103.296875 C 197.222656 103.296875 187.84375 93.921875 187.84375 82.398438 L 187.84375 43.539062 C 187.84375 32.019531 197.222656 22.648438 208.746094 22.648438 L 341.390625 22.648438 C 352.917969 22.648438 362.296875 32.019531 362.296875 43.539062 L 362.296875 82.398438 C 362.292969 93.921875 352.917969 103.296875 341.390625 103.296875 Z M 208.746094 27.863281 C 200.097656 27.863281 193.0625 34.894531 193.0625 43.539062 L 193.0625 82.398438 C 193.0625 91.046875 200.097656 98.082031 208.746094 98.082031 L 341.390625 98.082031 C 350.039062 98.082031 357.078125 91.046875 357.078125 82.398438 L 357.078125 43.539062 C 357.078125 34.894531 350.039062 27.863281 341.390625 27.863281 Z M 208.746094 27.863281 "
            fill-opacity="1"
            fill-rule="nonzero"
          />
        </g>
        <path
          fill="#d8d4d3"
          d="M 108.292969 143.980469 L 108.292969 135.367188 C 108.292969 126.429688 115.539062 119.1875 124.480469 119.1875 L 142.074219 119.1875 "
          fill-opacity="0"
          fill-rule="nonzero"
        />
        <path
          fill="#ffffff"
          d="M 108.292969 146.914062 C 106.671875 146.914062 105.355469 145.601562 105.355469 143.976562 L 105.355469 135.363281 C 105.355469 124.824219 113.933594 116.25 124.476562 116.25 L 142.070312 116.25 C 143.691406 116.25 145.007812 117.5625 145.007812 119.183594 C 145.007812 120.804688 143.691406 122.117188 142.070312 122.117188 L 124.476562 122.117188 C 117.167969 122.117188 111.226562 128.058594 111.226562 135.367188 L 111.226562 143.980469 C 111.226562 145.601562 109.910156 146.914062 108.292969 146.914062 Z M 108.292969 146.914062 "
          fill-opacity="0"
          fill-rule="nonzero"
        />
        <g fill="#000000" fill-opacity="1">
          <g transform="translate(14.1584, 340.704527)">
            <g>
              <path d="M 27.980469 -57.253906 L 7.417969 -57.253906 L 7.417969 0 L 14.515625 0 L 14.515625 -22.175781 L 27.980469 -22.175781 C 40.804688 -22.175781 48.304688 -28.789062 48.304688 -39.917969 C 48.304688 -50.804688 40.804688 -57.253906 27.980469 -57.253906 Z M 14.515625 -29.109375 L 14.515625 -50.320312 L 27.980469 -50.320312 C 36.609375 -50.320312 40.882812 -46.851562 40.882812 -39.917969 C 40.882812 -32.738281 36.609375 -29.109375 27.980469 -29.109375 Z M 14.515625 -29.109375 " />
            </g>
          </g>
        </g>
        <g fill="#000000" fill-opacity="1">
          <g transform="translate(66.652881, 340.704527)">
            <g>
              <path d="M 6.453125 -42.738281 L 6.453125 0 L 13.386719 0 L 13.386719 -25.480469 C 13.386719 -32.820312 16.371094 -36.609375 22.902344 -36.609375 L 27.09375 -36.609375 L 27.09375 -42.738281 L 22.902344 -42.738281 C 17.335938 -42.738281 14.191406 -40.320312 12.820312 -35.078125 L 12.578125 -42.738281 Z M 6.453125 -42.738281 " />
            </g>
          </g>
        </g>
        <g fill="#000000" fill-opacity="1">
          <g transform="translate(97.536729, 340.704527)">
            <g>
              <path d="M 23.386719 0.96875 C 35.238281 0.96875 42.980469 -7.742188 42.980469 -21.371094 C 42.980469 -34.996094 35.238281 -43.707031 23.386719 -43.707031 C 11.53125 -43.707031 3.789062 -34.996094 3.789062 -21.371094 C 3.789062 -7.742188 11.53125 0.96875 23.386719 0.96875 Z M 11.046875 -21.371094 C 11.046875 -31.207031 15.5625 -37.09375 23.386719 -37.09375 C 31.207031 -37.09375 35.722656 -31.207031 35.722656 -21.371094 C 35.722656 -11.53125 31.207031 -5.644531 23.386719 -5.644531 C 15.5625 -5.644531 11.046875 -11.53125 11.046875 -21.371094 Z M 11.046875 -21.371094 " />
            </g>
          </g>
        </g>
        <g fill="#000000" fill-opacity="1">
          <g transform="translate(144.306005, 340.704527)">
            <g>
              <path d="M 6.453125 12.097656 L 13.386719 12.097656 L 13.386719 -5.726562 C 15.726562 -1.289062 20.160156 0.96875 26.046875 0.96875 C 38.867188 0.96875 44.511719 -9.675781 44.511719 -21.371094 C 44.511719 -33.0625 38.867188 -43.707031 26.046875 -43.707031 C 19.835938 -43.707031 15.320312 -41.125 12.984375 -36.53125 L 12.742188 -42.738281 L 6.453125 -42.738281 Z M 12.578125 -21.371094 C 12.578125 -29.273438 16.128906 -37.09375 24.835938 -37.09375 C 33.625 -37.09375 37.09375 -29.351562 37.09375 -21.371094 C 37.09375 -13.386719 33.625 -5.644531 24.835938 -5.644531 C 16.128906 -5.644531 12.578125 -13.46875 12.578125 -21.371094 Z M 12.578125 -21.371094 " />
            </g>
          </g>
        </g>
        <g fill="#000000" fill-opacity="1">
          <g transform="translate(192.607371, 340.704527)">
            <g />
          </g>
        </g>
        <g fill="#000000" fill-opacity="1">
          <g transform="translate(212.766526, 340.704527)">
            <g>
              <path d="M 25.160156 -57.253906 L 7.417969 -57.253906 L 7.417969 0 L 25.644531 0 C 43.0625 0 52.738281 -10.242188 52.738281 -28.546875 C 52.738281 -46.933594 42.820312 -57.253906 25.160156 -57.253906 Z M 14.515625 -6.933594 L 14.515625 -50.320312 L 25.160156 -50.320312 C 38.625 -50.320312 45.320312 -43.140625 45.320312 -28.546875 C 45.320312 -14.113281 38.625 -6.933594 25.160156 -6.933594 Z M 14.515625 -6.933594 " />
            </g>
          </g>
        </g>
        <g fill="#000000" fill-opacity="1">
          <g transform="translate(269.454099, 340.704527)">
            <g>
              <path d="M 23.386719 0.96875 C 35.238281 0.96875 42.980469 -7.742188 42.980469 -21.371094 C 42.980469 -34.996094 35.238281 -43.707031 23.386719 -43.707031 C 11.53125 -43.707031 3.789062 -34.996094 3.789062 -21.371094 C 3.789062 -7.742188 11.53125 0.96875 23.386719 0.96875 Z M 11.046875 -21.371094 C 11.046875 -31.207031 15.5625 -37.09375 23.386719 -37.09375 C 31.207031 -37.09375 35.722656 -31.207031 35.722656 -21.371094 C 35.722656 -11.53125 31.207031 -5.644531 23.386719 -5.644531 C 15.5625 -5.644531 11.046875 -11.53125 11.046875 -21.371094 Z M 11.046875 -21.371094 " />
            </g>
          </g>
        </g>
        <g fill="#000000" fill-opacity="1">
          <g transform="translate(316.223375, 340.704527)">
            <g>
              <path d="M 33.949219 -28.386719 L 41.207031 -28.867188 C 40.078125 -38.0625 32.09375 -43.707031 23.386719 -43.707031 C 11.53125 -43.707031 3.789062 -34.996094 3.789062 -21.371094 C 3.789062 -7.742188 11.53125 0.96875 23.386719 0.96875 C 32.417969 0.96875 40.238281 -5 41.609375 -14.675781 L 34.273438 -15.160156 C 33.304688 -9.113281 28.707031 -5.644531 23.386719 -5.644531 C 15.5625 -5.644531 11.046875 -11.53125 11.046875 -21.371094 C 11.046875 -31.207031 15.5625 -37.09375 23.386719 -37.09375 C 28.464844 -37.09375 33.0625 -33.867188 33.949219 -28.386719 Z M 33.949219 -28.386719 " />
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
};
export default Logo;

type HorizontalLogoProps = {
  className?: string;
  height?: number;
  colour?: string;
};

export const HorizontalLogo: React.FC<HorizontalLogoProps> = ({
  className,
  colour = "#011627",
  height = 30,
}) => {
  const width = (492 / 131) * height;

  return (
    <div>
      <svg
        width={width}
        zoomAndPan="magnify"
        viewBox="0 0 369 98.24999"
        height={height}
        preserveAspectRatio="xMidYMid"
        version="1.0"
        id="svg46"
      >
        <defs id="defs6">
          <g id="g1" />
          <clipPath id="8925e70d73">
            <path
              d="M 11.136719,163 H 41 v 29 H 11.136719 Z m 0,0"
              clip-rule="nonzero"
              id="path1"
            />
          </clipPath>
          <clipPath id="0bef169b32">
            <path
              d="m 102,163 h 32.88672 v 29 H 102 Z m 0,0"
              clip-rule="nonzero"
              id="path2"
            />
          </clipPath>
          <clipPath id="12c023b517">
            <path
              d="M 11.136719,192 H 73 v 29 H 11.136719 Z m 0,0"
              clip-rule="nonzero"
              id="path3"
            />
          </clipPath>
          <clipPath id="261ef9631b">
            <path
              d="m 73,192 h 61.88672 v 29 H 73 Z m 0,0"
              clip-rule="nonzero"
              id="path4"
            />
          </clipPath>
          <clipPath id="aded202de4">
            <path
              d="M 11.136719,133.26172 H 73 V 162 H 11.136719 Z m 0,0"
              clip-rule="nonzero"
              id="path5"
            />
          </clipPath>
          <clipPath id="7f5cfb2d38">
            <path
              d="m 73,133.26172 h 61.88672 V 162 H 73 Z m 0,0"
              clip-rule="nonzero"
              id="path6"
            />
          </clipPath>
        </defs>
        <path
          fill="#d8d4d3"
          d="m 94.624483,54.940788 c 0,3.5625 -2.894531,6.44531 -6.464844,6.44531 H 41.292452 c -3.566407,0 -6.460938,-2.88281 -6.460938,-6.44531 v -13.69141 c 0,-3.55859 2.894531,-6.44531 6.460938,-6.44531 h 46.867187 c 3.570313,0 6.464844,2.88672 6.464844,6.44531 z m 0,0"
          fill-opacity="0"
          fill-rule="nonzero"
          id="path7"
        />
        <path
          fill={colour}
          d="M 88.159639,62.307978 H 41.296358 c -4.074219,0 -7.386719,-3.30469 -7.386719,-7.36328 v -13.69532 c 0,-4.0625 3.3125,-7.36328 7.386719,-7.36328 h 46.863281 c 4.074219,0 7.386724,3.30078 7.386724,7.36328 v 13.69141 c 0,4.0625 -3.312505,7.36719 -7.386724,7.36719 z M 41.292452,35.722038 c -3.054688,0 -5.539063,2.48047 -5.539063,5.52734 v 13.69141 c 0,3.05078 2.484375,5.52734 5.539063,5.52734 h 46.867187 c 3.054688,0 5.542974,-2.47656 5.542974,-5.52734 v -13.69141 c 0,-3.04687 -2.488286,-5.52734 -5.542974,-5.52734 z m 0,0"
          fill-opacity="1"
          fill-rule="nonzero"
          id="path8"
        />
        <path
          fill="#d8d4d3"
          d="M 25.854952,34.804068 H 5.1127643 v 26.58594 H 25.854952 c 3.566406,0 6.460937,-2.88672 6.460937,-6.44531 v -13.69532 c 0,-3.55859 -2.894531,-6.44531 -6.460937,-6.44531 z m 0,0"
          fill-opacity="0"
          fill-rule="nonzero"
          id="path9"
        />
        <g
          clip-path="url(#8925e70d73)"
          id="g10"
          transform="translate(-6.9380167,-129.55921)"
        >
          <path
            fill={colour}
            d="M 32.792969,191.86719 H 12.050781 c -0.507812,0 -0.921875,-0.41407 -0.921875,-0.91797 v -26.58594 c 0,-0.50781 0.414063,-0.91797 0.921875,-0.91797 h 20.742188 c 4.070312,0 7.382812,3.30078 7.382812,7.36328 V 184.5 c 0,4.0625 -3.3125,7.36719 -7.382812,7.36719 z m -19.820313,-1.83985 h 19.820313 c 3.054687,0 5.539062,-2.47656 5.539062,-5.52343 v -13.69532 c 0,-3.04687 -2.484375,-5.52734 -5.539062,-5.52734 H 12.972656 Z m 0,0"
            fill-opacity="1"
            fill-rule="nonzero"
            id="path10"
          />
        </g>
        <path
          fill="#d8d4d3"
          d="m 127.03464,34.804068 h -23.60938 c -3.570307,0 -6.464837,2.88672 -6.464837,6.44531 v 13.69141 c 0,3.5625 2.89453,6.44531 6.464837,6.44531 h 23.60938 z m 0,0"
          fill-opacity="0"
          fill-rule="nonzero"
          id="path11"
        />
        <g
          clip-path="url(#0bef169b32)"
          id="g12"
          transform="translate(-6.9380167,-129.55921)"
        >
          <path
            fill={colour}
            d="m 133.97266,191.86719 h -23.60938 c -4.07422,0 -7.38672,-3.30469 -7.38672,-7.36328 v -13.69532 c 0,-4.0625 3.3125,-7.36328 7.38672,-7.36328 h 23.60938 c 0.50781,0 0.92187,0.41016 0.92187,0.91797 v 26.58594 c 0,0.5039 -0.41406,0.91797 -0.92187,0.91797 z m -23.60938,-26.58594 c -3.05859,0 -5.54297,2.48047 -5.54297,5.52734 V 184.5 c 0,3.05078 2.48438,5.52734 5.54297,5.52734 h 22.6875 v -24.74609 z m 0,0"
            fill-opacity="1"
            fill-rule="nonzero"
            id="path12"
          />
        </g>
        <path
          fill="#d8d4d3"
          d="m 64.905733,83.944698 c 0,3.5625 -2.894531,6.44531 -6.464844,6.44531 H 11.577608 c -3.5703127,0 -6.4648437,-2.88281 -6.4648437,-6.44531 v -13.69532 c 0,-3.55859 2.894531,-6.44531 6.4648437,-6.44531 h 46.863281 c 3.570313,0 6.464844,2.88672 6.464844,6.44531 z m 0,0"
          fill-opacity="0"
          fill-rule="nonzero"
          id="path13"
        />
        <g
          clip-path="url(#12c023b517)"
          id="g14"
          transform="translate(-6.9380167,-129.55921)"
        >
          <path
            fill={colour}
            d="M 65.378906,220.86719 H 18.515625 c -4.074219,0 -7.386719,-3.30078 -7.386719,-7.36328 v -13.69532 c 0,-4.05859 3.3125,-7.36328 7.386719,-7.36328 h 46.863281 c 4.074219,0 7.386719,3.30469 7.386719,7.36328 v 13.69532 c 0,4.0625 -3.3125,7.36328 -7.386719,7.36328 z M 18.515625,194.28516 c -3.058594,0 -5.542969,2.47656 -5.542969,5.52343 v 13.69532 c 0,3.04687 2.484375,5.52734 5.542969,5.52734 h 46.863281 c 3.058594,0 5.542969,-2.48047 5.542969,-5.52734 v -13.69532 c 0,-3.04687 -2.484375,-5.52343 -5.542969,-5.52343 z m 0,0"
            fill-opacity="1"
            fill-rule="nonzero"
            id="path14"
          />
        </g>
        <path
          fill="#d8d4d3"
          d="m 126.85495,83.944698 c 0,3.5625 -2.89453,6.44531 -6.46484,6.44531 H 73.526827 c -3.570313,0 -6.464844,-2.88281 -6.464844,-6.44531 v -13.69532 c 0,-3.55859 2.894531,-6.44531 6.464844,-6.44531 h 46.863283 c 3.57031,0 6.46484,2.88672 6.46484,6.44531 z m 0,0"
          fill-opacity="0"
          fill-rule="nonzero"
          id="path15"
        />
        <g
          clip-path="url(#261ef9631b)"
          id="g16"
          transform="translate(-6.9380167,-129.55921)"
        >
          <path
            fill={colour}
            d="M 127.32813,220.86719 H 80.464844 c -4.074219,0 -7.386719,-3.30078 -7.386719,-7.36328 v -13.69532 c 0,-4.05859 3.3125,-7.36328 7.386719,-7.36328 h 46.863286 c 4.07421,0 7.38671,3.30469 7.38671,7.36328 v 13.69532 c 0,4.0625 -3.3125,7.36328 -7.38671,7.36328 z M 80.464844,194.28516 c -3.058594,0 -5.542969,2.47656 -5.542969,5.52343 v 13.69532 c 0,3.04687 2.484375,5.52734 5.542969,5.52734 h 46.863286 c 3.05859,0 5.54296,-2.48047 5.54296,-5.52734 v -13.69532 c 0,-3.04687 -2.48437,-5.52343 -5.54296,-5.52343 z m 0,0"
            fill-opacity="1"
            fill-rule="nonzero"
            id="path16"
          />
        </g>
        <path
          fill="#d8d4d3"
          d="m 64.905733,24.901728 c 0,3.55859 -2.894531,6.44531 -6.464844,6.44531 H 11.577608 c -3.5703127,0 -6.4648437,-2.88672 -6.4648437,-6.44531 v -13.69532 c 0,-3.5585904 2.894531,-6.4453104 6.4648437,-6.4453104 h 46.863281 c 3.570313,0 6.464844,2.88672 6.464844,6.4453104 z m 0,0"
          fill-opacity="0"
          fill-rule="nonzero"
          id="path17"
        />
        <g
          clip-path="url(#aded202de4)"
          id="g18"
          transform="translate(-6.9380167,-129.55921)"
        >
          <path
            fill={colour}
            d="M 65.378906,161.82422 H 18.515625 c -4.074219,0 -7.386719,-3.30469 -7.386719,-7.36328 v -13.69532 c 0,-4.05859 3.3125,-7.36328 7.386719,-7.36328 h 46.863281 c 4.074219,0 7.386719,3.30469 7.386719,7.36328 v 13.69532 c 0,4.0625 -3.3125,7.36328 -7.386719,7.36328 z M 18.515625,135.24219 c -3.058594,0 -5.542969,2.47656 -5.542969,5.52343 v 13.69532 c 0,3.04687 2.484375,5.52734 5.542969,5.52734 h 46.863281 c 3.058594,0 5.542969,-2.48047 5.542969,-5.52734 v -13.69532 c 0,-3.04687 -2.484375,-5.52343 -5.542969,-5.52343 z m 0,0"
            fill-opacity="1"
            fill-rule="nonzero"
            id="path18"
          />
        </g>
        <path
          fill="#d8d4d3"
          d="m 126.85495,24.901728 c 0,3.55859 -2.89453,6.44531 -6.46484,6.44531 H 73.526827 c -3.570313,0 -6.464844,-2.88672 -6.464844,-6.44531 v -13.69532 c 0,-3.5585904 2.894531,-6.4453104 6.464844,-6.4453104 h 46.863283 c 3.57031,0 6.46484,2.88672 6.46484,6.4453104 z m 0,0"
          fill-opacity="0"
          fill-rule="nonzero"
          id="path19"
        />
        <g
          clip-path="url(#7f5cfb2d38)"
          id="g20"
          transform="translate(-6.9380167,-129.55921)"
        >
          <path
            fill={colour}
            d="M 127.32813,161.82422 H 80.464844 c -4.074219,0 -7.386719,-3.30469 -7.386719,-7.36328 v -13.69532 c 0,-4.05859 3.3125,-7.36328 7.386719,-7.36328 h 46.863286 c 4.07421,0 7.38671,3.30469 7.38671,7.36328 v 13.69532 c 0,4.0625 -3.3125,7.36328 -7.38671,7.36328 z M 80.464844,135.24219 c -3.058594,0 -5.542969,2.47656 -5.542969,5.52343 v 13.69532 c 0,3.04687 2.484375,5.52734 5.542969,5.52734 h 46.863286 c 3.05859,0 5.54296,-2.48047 5.54296,-5.52734 v -13.69532 c 0,-3.04687 -2.48437,-5.52343 -5.54296,-5.52343 z m 0,0"
            fill-opacity="1"
            fill-rule="nonzero"
            id="path20"
          />
        </g>
        <path
          fill="#d8d4d3"
          d="m 38.034639,46.604848 v -3.03515 c 0,-3.14844 2.558594,-5.70313 5.71875,-5.70313 h 6.214844"
          fill-opacity="0"
          fill-rule="nonzero"
          id="path21"
        />
        <path
          fill="#ffffff"
          d="m 38.034639,47.640008 c -0.574218,0 -1.039062,-0.46485 -1.039062,-1.03516 v -3.03515 c 0,-3.71485 3.03125,-6.73829 6.757812,-6.73829 h 6.214844 c 0.574219,0 1.035156,0.46485 1.035156,1.03516 0,0.57031 -0.460937,1.03516 -1.035156,1.03516 h -6.214844 c -2.582031,0 -4.683594,2.09375 -4.683594,4.66797 v 3.03515 c 0,0.57031 -0.464843,1.03516 -1.035156,1.03516 z m 0,0"
          fill-opacity="0"
          fill-rule="nonzero"
          id="path22"
        />
        <g
          fill="#000000"
          fill-opacity="1"
          id="g25"
          transform="translate(-6.9380167,-129.55921)"
        >
          <g transform="translate(142.31101,195.82954)" id="g24">
            <g id="g23">
              <path
                d="M 18.691406,-38.25 H 4.957031 V 0 h 4.738281 v -14.816406 h 8.996094 c 8.566406,0 13.578125,-4.414063 13.578125,-11.851563 0,-7.269531 -5.011719,-11.582031 -13.578125,-11.582031 z m -8.996094,18.800781 v -14.167969 h 8.996094 c 5.765625,0 8.621094,2.316407 8.621094,6.949219 0,4.796875 -2.855469,7.21875 -8.621094,7.21875 z m 0,0"
                id="path23"
              />
            </g>
          </g>
        </g>
        <g
          fill="#000000"
          fill-opacity="1"
          id="g28"
          transform="translate(-6.9380167,-129.55921)"
        >
          <g transform="translate(177.37981,195.82954)" id="g27">
            <g id="g26">
              <path
                d="M 4.308594,-28.550781 V 0 h 4.632812 v -17.023438 c 0,-4.902343 1.996094,-7.433593 6.359375,-7.433593 h 2.800781 v -4.09375 h -2.800781 c -3.71875,0 -5.820312,1.613281 -6.734375,5.117187 l -0.164062,-5.117187 z m 0,0"
                id="path25"
              />
            </g>
          </g>
        </g>
        <g
          fill="#000000"
          fill-opacity="1"
          id="g31"
          transform="translate(-6.9380167,-129.55921)"
        >
          <g transform="translate(198.01168,195.82954)" id="g30">
            <g id="g29">
              <path
                d="m 15.621094,0.644531 c 7.921875,0 13.09375,-5.816406 13.09375,-14.921875 0,-9.101562 -5.171875,-14.921875 -13.09375,-14.921875 -7.917969,0 -13.089844,5.820313 -13.089844,14.921875 0,9.105469 5.171875,14.921875 13.089844,14.921875 z M 7.378906,-14.277344 c 0,-6.570312 3.019532,-10.503906 8.242188,-10.503906 5.226562,0 8.242187,3.933594 8.242187,10.503906 0,6.574219 -3.015625,10.507813 -8.242187,10.507813 -5.222656,0 -8.242188,-3.933594 -8.242188,-10.507813 z m 0,0"
                id="path28"
              />
            </g>
          </g>
        </g>
        <g
          fill="#000000"
          fill-opacity="1"
          id="g34"
          transform="translate(-6.9380167,-129.55921)"
        >
          <g transform="translate(229.25577,195.82954)" id="g33">
            <g id="g32">
              <path
                d="m 4.308594,8.082031 h 4.632812 v -11.90625 c 1.5625,2.960938 4.527344,4.46875 8.460938,4.46875 8.5625,0 12.335937,-7.109375 12.335937,-14.921875 0,-7.808594 -3.773437,-14.921875 -12.335937,-14.921875 -4.148438,0 -7.167969,1.726563 -8.730469,4.796875 L 8.511719,-28.550781 H 4.308594 Z m 4.09375,-22.359375 c 0,-5.277344 2.371094,-10.503906 8.191406,-10.503906 5.871094,0 8.1875,5.171875 8.1875,10.503906 0,5.335938 -2.316406,10.507813 -8.1875,10.507813 -5.820312,0 -8.191406,-5.226563 -8.191406,-10.507813 z m 0,0"
                id="path31"
              />
            </g>
          </g>
        </g>
        <g fill="#000000" fill-opacity="1" id="g37">
          <g transform="translate(261.52337,195.82954)" id="g36">
            <g id="g35" />
          </g>
        </g>
        <g
          fill="#000000"
          fill-opacity="1"
          id="g40"
          transform="translate(-6.9380167,-129.55921)"
        >
          <g transform="translate(274.99064,195.82954)" id="g39">
            <g id="g38">
              <path
                d="M 16.808594,-38.25 H 4.957031 V 0 h 12.175781 c 11.632813,0 18.097657,-6.839844 18.097657,-19.070312 0,-12.28125 -6.625,-19.179688 -18.421875,-19.179688 z M 9.695312,-4.632812 v -28.984376 h 7.113282 c 8.996094,0 13.46875,4.796876 13.46875,14.546876 0,9.644531 -4.472656,14.4375 -13.46875,14.4375 z m 0,0"
                id="path37"
              />
            </g>
          </g>
        </g>
        <g
          fill="#000000"
          fill-opacity="1"
          id="g43"
          transform="translate(-6.9380167,-129.55921)"
        >
          <g transform="translate(312.86062,195.82954)" id="g42">
            <g id="g41">
              <path
                d="m 15.621094,0.644531 c 7.921875,0 13.09375,-5.816406 13.09375,-14.921875 0,-9.101562 -5.171875,-14.921875 -13.09375,-14.921875 -7.917969,0 -13.089844,5.820313 -13.089844,14.921875 0,9.105469 5.171875,14.921875 13.089844,14.921875 z M 7.378906,-14.277344 c 0,-6.570312 3.019532,-10.503906 8.242188,-10.503906 5.226562,0 8.242187,3.933594 8.242187,10.503906 0,6.574219 -3.015625,10.507813 -8.242187,10.507813 -5.222656,0 -8.242188,-3.933594 -8.242188,-10.507813 z m 0,0"
                id="path40"
              />
            </g>
          </g>
        </g>
        <g
          fill="#000000"
          fill-opacity="1"
          id="g46"
          transform="translate(-6.9380167,-129.55921)"
        >
          <g transform="translate(344.10471,195.82954)" id="g45">
            <g id="g44">
              <path
                d="m 22.679688,-18.960938 4.847656,-0.324218 c -0.753906,-6.140625 -6.085938,-9.914063 -11.90625,-9.914063 -7.917969,0 -13.089844,5.820313 -13.089844,14.921875 0,9.105469 5.171875,14.921875 13.089844,14.921875 6.035156,0 11.261718,-3.984375 12.175781,-10.449219 l -4.902344,-0.324218 c -0.644531,4.042968 -3.714843,6.359375 -7.273437,6.359375 -5.222656,0 -8.242188,-3.933594 -8.242188,-10.507813 0,-6.570312 3.019532,-10.503906 8.242188,-10.503906 3.394531,0 6.464844,2.15625 7.058594,5.820312 z m 0,0"
                id="path43"
              />
            </g>
          </g>
        </g>
        <rect
          id="rect46"
          fillOpacity={0}
          width="159.0106"
          height="73.354691"
          x="9.0903263"
          y="128.67667"
          ry="10.355325"
        />
      </svg>
    </div>
  );
};
