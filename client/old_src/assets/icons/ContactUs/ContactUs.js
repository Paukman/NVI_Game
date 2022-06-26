// default props will be depricated with the use of es6 defaults
/* eslint-disable react/require-default-props */
import React from "react";
import PropTypes from "prop-types";
import "./styles.less";

const imageClass = "contactUsPageImage";

const ContactUs = ({ width = 490, height = 343 }) => {
  ContactUs.propTypes = {
    width: PropTypes.number,
    height: PropTypes.number
  };
  return (
    <svg
      width={`${width}px`}
      height={`${height}px`}
      version="1.1"
      x="0px"
      y="0px"
      viewBox="0 0 360 324"
      style={{ enableBackground: "new 0 0 360 324" }}
    >
      <path
        className={`st0 ${imageClass}`}
        d="M253.68,204.15h-16.94l8.52-34.29h-53.29l-7.39,29.73h-26.61v4.56h-2.62v-15.86h-1.45l1.37-4.98
	c0.18-0.66-0.21-1.34-0.87-1.52l-0.24-0.07c-0.66-0.18-1.34,0.21-1.52,0.87l-1.56,5.7h-9.06v15.86H52.79
	c-2.99,0-5.41,2.42-5.41,5.41v0.58v13.13v65.08h10.39v-65.08h190.94v65.08h10.39v-65.08v-13.13v-0.58
	C259.09,206.57,256.67,204.15,253.68,204.15z M188.07,199.59l6.56-26.34h46.3l-6.56,26.34H188.07z"
      />
      <path
        className={`st1 ${imageClass}`}
        d="M155.59,151.09c0,0,17.59-4.07,21.15-22.47c0.15-0.51,1.02-7.42-1.12-14.03l4.88-10.98l2.34,0.41l2.64-8.64
	l2.08,0.25l1.12,1.58l2.95,0.81l0.36,5.39l1.83,1.93l0.1,3.97l-4.68,15.25l-1.73,3.05l-2.64,9.36c0,0-8.44,25.53-24.15,30.81
	L155.59,151.09z"
      />
      <circle
        className={`st0 ${imageClass}`}
        cx="273.85"
        cy="88.02"
        r="57.98"
      />
      <path
        className={`st2 ${imageClass}`}
        d="M245.27,73.37l-2.84,1.19l-2.59,0.69l-2.12,4.6l-2.29,3.2c0,0-1.37,12.13,0.08,16.25
	c1.45,4.12,0.53,10.6,0.53,10.6l8.85-4.04c0,0,0.15-5.87,4.73-12.2l-1.53-10.75l-1.98-0.69L245.27,73.37z"
      />
      <polygon
        className={`st0 ${imageClass}`}
        points="225.97,288.35 200.5,288.35 195.06,244.27 231.42,244.27 "
      />
      <path
        className={`st3 ${imageClass}`}
        d="M106.11,109.46c0,0-12.35,2.44-10.46,8.57c1.89,6.13,4.22,13.74,4.22,13.74s3.01-2.49,7.73-1.78
	c0.16,0.08-2.12-7.71,7.86-10.7s18.88-5.27,18.88-5.27s6.53-3.46,3.46-9.52c-3.07-6.06-11.56-5.51-14.63-3.07
	c0.08,0.08-4.09-5.98-10.54-3.07C106.19,101.28,106.11,102.85,106.11,109.46z"
      />
      <g>
        <ellipse
          className={`st1 ${imageClass}`}
          cx="286.84"
          cy="58.07"
          rx="9.76"
          ry="8.66"
        />
        <path
          className={`st4 ${imageClass}`}
          d="M286.84,67.73c-5.93,0-10.76-4.33-10.76-9.66s4.83-9.66,10.76-9.66s10.76,4.33,10.76,9.66
		S292.77,67.73,286.84,67.73z M286.84,50.42c-4.83,0-8.76,3.43-8.76,7.66s3.93,7.66,8.76,7.66s8.76-3.43,8.76-7.66
		S291.67,50.42,286.84,50.42z"
        />
      </g>
      <path
        className={`st1 ${imageClass}`}
        d="M261.16,80.34c0,0-1.63-13.42,11.08-18c12.71-4.58,20.44,6.31,20.14,9.46c0.1,0-8.75,2.44-13.93-3.05
	C278.55,68.75,271.53,81.97,261.16,80.34z"
      />
      <path
        className={`st1 ${imageClass}`}
        d="M80.94,169.82l11.82,12.74c0,0-1.68,4.65-35.16,16.17c0.08,0.15-7.78,13.96-16.4,10.07
	c0-0.08-2.14,2.97-2.14,2.97l-1.14,2.97c0,0-2.21,2.44-3.2,0c0-0.08-1.37-2.52-1.37-2.52l-1.91-8.24c0,0,1.22-3.97,4.27-5.8
	c3.05-1.83,24.03-10.53,24.03-10.53l12.2-9.08L80.94,169.82z"
      />
      <path
        className={`st1 ${imageClass}`}
        d="M131.86,114.99c0,0-19.4,3.88-21.29,6.29c-1.89,2.41-3.95,6.38-2.66,9.11c0,0-6.15-1.35-8.04,1.37
	c-1.89,2.73-3.78,7.03,0.84,9.02c4.61,1.99,8.39,0.94,9.33,0.31c0,0.1,9.75,10.28,19.82,5.56
	C129.97,146.66,144.54,142.46,131.86,114.99z"
      />
      <path
        className={`st4 ${imageClass}`}
        d="M193.52,284.83h-41.03c-0.32,0-0.62-0.16-0.81-0.42c-0.19-0.26-0.24-0.6-0.13-0.9c1.96-5.79,3-12.06,3.09-18.64
	l0.01-1l2,0.03l-0.01,1c-0.09,6.29-1.02,12.32-2.77,17.94h36.71c-4.1-2.99-13.03-8.87-21.73-10.36c-0.46-0.08-0.8-0.46-0.83-0.93
	l-0.33-5.65l2-0.12l0.29,4.87c12.02,2.38,23.7,12,24.2,12.42c0.32,0.27,0.45,0.71,0.3,1.11
	C194.32,284.57,193.94,284.83,193.52,284.83z"
      />
      <path
        className={`st4 ${imageClass}`}
        d="M205.92,281.17h-17.07v-2h14.12c-4.1-2.99-13.03-8.87-21.73-10.36c-0.45-0.08-0.78-0.44-0.83-0.89l-0.36-3.74
	l1.99-0.19l0.28,2.99c12.03,2.38,23.73,12,24.23,12.42c0.32,0.27,0.45,0.71,0.3,1.11C206.72,280.91,206.35,281.17,205.92,281.17z"
      />
      <path
        className={`st4 ${imageClass}`}
        d="M31.49,208.22l-0.38-0.92c-0.8-1.92-0.81-3.77-0.04-5.49c2.31-5.16,11.33-8.32,20.88-11.66l0.71-0.25
	c10.34-3.62,21.64-14.9,29.89-23.14c1.31-1.31,2.55-2.55,3.71-3.68c8.6-8.39,23.13-13.83,23.74-14.05c0.24-0.09,0.51-0.08,0.75,0.02
	l14.55,6.49c1.04-0.69,3.69-2.44,6.35-4.19c1.7-1.12,3.41-2.24,4.69-3.08c2.65-1.73,2.87-1.88,3.33-1.34
	c7.7,3.86,14.64,4.43,20.62,1.7c11.48-5.24,15.61-20.62,15.65-20.77c0.75-2.98-0.64-11.33-1.24-12.93
	c-0.65-1.73,2.57-7.41,5.38-11.87c0.28-0.44,0.85-0.59,1.31-0.35c0.05,0.02,4.4,2.41,1.37,8.99c0.75,0.81,1.38,1.96,1.39,1.98
	c1.25,2.37,1.19,4.77-0.16,6.75l-0.56,0.83l-1.65-1.13l0.56-0.83c2.06-3.01-0.99-6.19-1.3-6.5c-0.14-0.08-0.27-0.2-0.35-0.35
	c-0.18-0.3-0.19-0.67-0.03-0.98c1.82-3.54,1.17-5.45,0.5-6.34c-2.37,3.88-4.64,8.23-4.55,9.17c0.67,1.76,2.15,10.6,1.29,14.04
	c-0.04,0.16-4.43,16.48-16.76,22.11c-6.48,2.96-13.9,2.43-22.05-1.58c-1.78,1.14-8.52,5.59-13.13,8.64
	c-0.28,0.19-0.65,0.22-0.96,0.08l-14.67-6.54c-2.35,0.92-15.12,6.1-22.66,13.46c-1.15,1.12-2.39,2.36-3.69,3.66
	c-8.39,8.38-19.87,19.85-30.64,23.62l-0.71,0.25c-8.73,3.05-17.75,6.21-19.71,10.59c-0.54,1.21-0.52,2.49,0.06,3.91l0.38,0.92
	L31.49,208.22z M181.51,112.93C181.52,112.93,181.52,112.93,181.51,112.93C181.52,112.93,181.52,112.93,181.51,112.93z
	 M181.51,112.93C181.51,112.93,181.51,112.93,181.51,112.93C181.51,112.93,181.51,112.93,181.51,112.93z M181.51,112.93
	C181.51,112.93,181.51,112.93,181.51,112.93C181.51,112.93,181.51,112.93,181.51,112.93z M181.5,112.93
	C181.5,112.93,181.5,112.93,181.5,112.93C181.5,112.93,181.5,112.93,181.5,112.93z M181.5,112.93L181.5,112.93L181.5,112.93z"
      />
      <path
        className={`st4 ${imageClass}`}
        d="M44.39,210.52c-0.87,0-1.76-0.13-2.68-0.41l-0.96-0.29l0.58-1.92l0.96,0.29c7.82,2.37,14.01-9.74,14.07-9.86
	c0.12-0.23,0.32-0.41,0.57-0.5c30.47-10.48,34.15-14.91,34.29-15.09l0.58-0.76l1.59,1.07l-0.51,0.81
	c-0.31,0.49-3.91,5.04-34.92,15.74C56.88,201.58,51.68,210.51,44.39,210.52z"
      />
      <path
        className={`st4 ${imageClass}`}
        d="M36.19,216.52c-0.73,0-1.42-0.28-1.91-0.79c-0.69-0.71-0.89-1.73-0.56-2.81l0.24-0.79
	c0.75-2.54,1.69-5.69,5.03-9.17l0.69-0.72l1.44,1.38l-0.69,0.72c-3,3.13-3.83,5.91-4.55,8.36l-0.24,0.8
	c-0.06,0.21-0.14,0.6,0.08,0.82c0.16,0.17,0.45,0.22,0.73,0.14c0.52-0.15,0.93-0.69,1.12-1.49c0.88-3.76,6.43-8.11,6.67-8.29
	l0.79-0.61l1.23,1.58l-0.79,0.61c-1.45,1.13-5.35,4.62-5.95,7.17c-0.36,1.54-1.29,2.61-2.54,2.96
	C36.71,216.48,36.45,216.52,36.19,216.52z"
      />
      <path
        className={`st4 ${imageClass}`}
        d="M35.31,214.47l-0.94-0.29c-0.08-0.02-1.87-0.6-2.64-2.63c-0.8-2.14-0.14-4.97,1.97-8.41l0.52-0.85l1.71,1.04
	l-0.52,0.85c-2.19,3.57-2.19,5.57-1.81,6.62c0.4,1.12,1.34,1.45,1.38,1.46l0.93,0.32L35.31,214.47z"
      />
      <path
        className={`st4 ${imageClass}`}
        d="M187.5,108.97l-1.85-0.76l0.38-0.92c0.48-1.16,1.89-6.32,1.76-8.03c-0.1-1.27-0.48-2.14-1.04-2.39
	c-0.28-0.12-0.56-0.07-0.69-0.01c-0.41,1.71-2.25,7.31-2.47,7.97l-0.31,0.95l-1.9-0.63l0.31-0.95c0.61-1.86,2.25-6.91,2.46-7.97
	c0.18-0.88,1.26-1.5,2.42-1.44c0.68,0.04,2.92,0.47,3.22,4.3c0.17,2.28-1.45,7.85-1.9,8.95L187.5,108.97z"
      />
      <path
        className={`st4 ${imageClass}`}
        d="M190.28,112.77l-1.87-0.72l0.36-0.93c3.12-8.14,2.35-11.31,1.61-12.48c-0.56-0.89-1.31-0.96-1.34-0.96
	l-0.97-0.08l0.08-1.95l0.98,0.03c0.18,0.01,1.76,0.11,2.88,1.8c1.74,2.62,1.27,7.45-1.38,14.36L190.28,112.77z"
      />
      <path
        className={`st4 ${imageClass}`}
        d="M160.24,169.09l-0.85-1.81l0.9-0.43c17.09-8.08,22.17-25.75,24.9-35.25c0.78-2.71,1.34-4.66,1.98-5.71
	c2.33-3.79,4.59-12.75,4.61-12.84c0.01-0.04,0.02-0.08,0.04-0.13c2.56-6.47,0.07-8.85-0.04-8.95l-0.72-0.67l1.29-1.48l0.75,0.64
	c0.15,0.13,3.69,3.28,0.61,11.13c-0.23,0.9-2.42,9.42-4.83,13.34c-0.5,0.82-1.06,2.76-1.77,5.22c-2.81,9.8-8.05,28.04-25.96,36.5
	L160.24,169.09z"
      />
      <path
        className={`st4 ${imageClass}`}
        d="M194.13,93.59l-0.29-0.69c-3.01-7.34-9.8-7.28-10.07-7.26l-0.75,0.02l-0.04-1.5l0.75-0.02
	c0.09-0.02,8.09-0.11,11.49,8.19l0.28,0.69L194.13,93.59z"
      />
      <path
        className={`st4 ${imageClass}`}
        d="M317.01,130.44l-0.18-0.98c-4.82-25.59-23.54-30.2-27.07-30.83c-3.89,8.61-11.86,12.89-12.21,13.07
	c-0.38,0.2-0.84,0.14-1.15-0.15c-3.44-3.2-4.14-7.51-4.26-9.55c-13.75,1.84-23.22,24.72-23.32,24.96c-0.15,0.38-0.52,0.62-0.93,0.62
	c0,0,0,0,0,0c-0.41,0-0.77-0.25-0.92-0.63c-8.26-20.6,0.5-31.77,1.53-32.98c0.33-0.95-0.33-5.56-1.21-9.8
	c-0.81,0.7-1.77,2.29-1.05,5.82c0.07,0.34-0.04,0.69-0.3,0.93c-0.12,0.11-0.27,0.19-0.43,0.23c-0.37,0.21-3.96,2.33-2.87,5.59
	l0.32,0.95l-1.9,0.64l-0.32-0.95c-0.74-2.19-0.16-4.43,1.62-6.29c0.01-0.01,0.88-0.9,1.78-1.46c-1.05-6.85,3.6-7.92,3.64-7.93
	c0.54-0.12,1.07,0.23,1.18,0.76c1.1,5.01,2.19,11.27,1.16,12.68c-0.15,0.17-8.7,10.11-2.15,28.81c1.13-2.4,3.19-6.39,6.05-10.47
	c6.05-8.65,12.45-13.21,19.04-13.58c0.28-0.02,0.56,0.09,0.76,0.29c0.2,0.2,0.31,0.48,0.29,0.76c0,0.05-0.2,5.04,3.13,8.61
	c1.97-1.21,8.06-5.39,10.97-12.4c0.05-0.12,0.12-0.23,0.22-0.32c0.23-0.23,0.71-0.71,4.85,0.57c6.24,1.92,21.21,8.85,25.52,31.68
	l0.19,0.98L317.01,130.44z"
      />
      <path
        className={`st4 ${imageClass}`}
        d="M240.74,85.77l-0.11-0.99c-0.14-1.19-0.04-6.16,0.72-8.21c1.29-3.49,3.13-3.5,3.87-3.33
	c0.95,0.21,1.64,1.02,1.57,1.85c-0.07,0.9,0.18,4.97,0.37,7.49l0.08,1l-1.99,0.15l-0.08-1c-0.05-0.62-0.43-5.83-0.39-7.54
	c-0.03,0-0.06-0.01-0.11,0c-0.12,0.03-0.78,0.25-1.45,2.07c-0.57,1.54-0.75,6.12-0.61,7.29l0.12,0.99L240.74,85.77z"
      />
      <path
        className={`st4 ${imageClass}`}
        d="M237.28,87.76l-0.07-1c-0.46-6.45,0.36-10.64,2.45-12.45c1.31-1.14,2.62-0.9,2.76-0.87l0.98,0.21l-0.42,1.96
	l-0.96-0.21c-0.07,0-0.56-0.04-1.11,0.47c-0.87,0.81-2.24,3.28-1.7,10.74l0.07,1L237.28,87.76z"
      />
      <path
        className={`st4 ${imageClass}`}
        d="M235.22,110.32l-0.02-1c-0.03-1.37-0.03-2.61-0.04-3.7c-0.01-2.27-0.02-4.07-0.26-4.95
	c-1.24-4.38-1.14-11.75-1.13-12.06c0.03-8.02,3.36-9.87,3.73-10.05l0.9-0.44l0.88,1.8l-0.88,0.43c-0.12,0.07-2.6,1.65-2.63,8.29
	c0,0.08-0.1,7.41,1.06,11.5c0.32,1.14,0.33,2.87,0.34,5.48c0,1.08,0.01,2.31,0.04,3.67l0.02,1L235.22,110.32z"
      />
      <path
        className={`st4 ${imageClass}`}
        d="M229.12,82.29l-1.5-0.02l0.01-0.75c0.14-8.61,7.32-11.31,7.4-11.33l0.7-0.25l0.51,1.41l-0.7,0.26
	c-0.26,0.09-6.29,2.39-6.41,9.95L229.12,82.29z"
      />
      <path
        className={`st4 ${imageClass}`}
        d="M123.84,148.7c-7.15,0-12.15-4.9-13.82-6.8c-1.4,0.81-3.08,1.25-4.8,1.25c-4.66,0-8.45-3.18-8.45-7.08
	c0-1.76,0.77-3.38,2.05-4.62l-0.1-0.29c-0.01-0.04-1.29-3.67-3.79-11.57c-0.64-2.03-0.44-3.9,0.6-5.55c2.18-3.47,7.54-4.92,9.84-5.4
	c-0.63-3.53,0.08-9.27,6.58-11.28c5.87-1.81,9.67,0.4,11.27,3.06c0.02,0.03,0.03,0.05,0.05,0.08c4.55-2.13,8.96-2.19,12.23-0.15
	c2.56,1.6,4.08,4.37,3.97,7.23c-0.15,3.91-1.69,5.99-6.45,7.81c1.42,3.05,11.23,25.31-1.45,31.43
	C128.78,148.17,126.19,148.7,123.84,148.7z M110.22,139.57c0.05,0,0.1,0,0.15,0.01c0.26,0.04,0.5,0.18,0.66,0.4
	c0.32,0.44,8,10.68,19.66,5.04c11.15-5.39,1.22-27.27,0.42-28.97c-2.73,0.87-6.29,1.72-10.89,2.74c-5.76,1.28-9.58,3.47-11.05,6.33
	c-1.3,2.54-0.38,4.77-0.34,4.87c0.15,0.36,0.08,0.78-0.18,1.07c-0.26,0.29-0.67,0.4-1.04,0.28c-0.76-0.24-1.56-0.36-2.39-0.36
	c-3.55,0-6.45,2.28-6.45,5.08c0,2.8,2.89,5.08,6.45,5.08c1.64,0,3.21-0.49,4.41-1.38C109.8,139.64,110.01,139.57,110.22,139.57z
	 M116.06,98.69c-1.08,0-2.25,0.2-3.52,0.59c-7.15,2.2-5.09,9.57-5,9.88c0.08,0.28,0.04,0.58-0.12,0.82s-0.41,0.41-0.7,0.45
	c-0.07,0.01-7.24,1.08-9.5,4.68c-0.72,1.15-0.84,2.42-0.38,3.88c2.08,6.6,3.31,10.2,3.66,11.21c1.35-0.76,2.97-1.21,4.72-1.21
	c0.45,0,0.9,0.03,1.33,0.09c-0.17-1.22-0.12-2.96,0.81-4.81c1.76-3.48,5.94-5.98,12.42-7.42c15.02-3.34,17.49-4.65,17.67-9.34
	c0.08-2.15-1.08-4.24-3.03-5.46c-2.89-1.81-6.98-1.55-11.23,0.72c-0.44,0.23-0.98,0.11-1.27-0.29c-0.13-0.18-0.19-0.38-0.2-0.59
	c-0.14-0.36-0.78-1.54-2.25-2.37C118.49,98.96,117.35,98.69,116.06,98.69z M121.97,101.23
	C121.97,101.23,121.97,101.23,121.97,101.23C121.97,101.23,121.97,101.23,121.97,101.23z M122.02,101.18
	c-0.02,0.02-0.03,0.03-0.04,0.05C121.99,101.21,122,101.2,122.02,101.18z M122.02,101.18C122.02,101.18,122.02,101.18,122.02,101.18
	C122.02,101.18,122.02,101.18,122.02,101.18z M122.02,101.18C122.02,101.18,122.02,101.18,122.02,101.18
	C122.02,101.18,122.02,101.18,122.02,101.18z M122.02,101.18C122.02,101.18,122.02,101.18,122.02,101.18
	C122.02,101.18,122.02,101.18,122.02,101.18z M122.03,101.17C122.03,101.17,122.02,101.18,122.03,101.17
	C122.02,101.18,122.02,101.17,122.03,101.17z"
      />
      <path
        className={`st4 ${imageClass}`}
        d="M148.7,209.85l-0.11-0.99c-1.97-18.04-2.26-30.59-0.82-35.32l0.01-0.02c0-0.11,0.03-0.22,0.07-0.33
	c0.15-0.37,0.5-0.62,0.9-0.63c5.71-0.15,9.91-1.49,11.68-2.16c-3.43-7.36-5.82-18.12-5.92-18.59l-0.22-0.98l1.95-0.43l0.22,0.98
	c0.03,0.12,2.66,11.97,6.22,19.09c0.12,0.24,0.14,0.52,0.05,0.77c-0.09,0.25-0.27,0.46-0.51,0.58c-0.21,0.1-5.04,2.38-12.66,2.71
	c-0.75,2.99-1.47,11.28,1.01,34.11l0.11,0.99L148.7,209.85z M148.06,174.27L148.06,174.27L148.06,174.27z M148.06,174.26
	C148.06,174.26,148.06,174.26,148.06,174.26C148.06,174.26,148.06,174.26,148.06,174.26z M148.06,174.26
	C148.06,174.26,148.06,174.26,148.06,174.26C148.06,174.26,148.06,174.26,148.06,174.26z M148.06,174.26
	C148.06,174.26,148.06,174.26,148.06,174.26C148.06,174.26,148.06,174.26,148.06,174.26z M148,174.2c0.02,0.02,0.04,0.04,0.06,0.06
	C148.04,174.24,148.02,174.22,148,174.2z"
      />
      <path
        className={`st4 ${imageClass}`}
        d="M89.59,293.75c-26.12,0-47.37-21.98-47.37-49s21.25-49,47.37-49c26.12,0,47.37,21.98,47.37,49
	S115.71,293.75,89.59,293.75z M89.59,197.75c-25.02,0-45.37,21.08-45.37,47s20.35,47,45.37,47s45.37-21.08,45.37-47
	S114.6,197.75,89.59,197.75z"
      />
      <path
        className={`st4 ${imageClass}`}
        d="M89.59,284.7c-21.3,0-38.63-17.92-38.63-39.95s17.33-39.95,38.63-39.95c6.44,0,12.81,1.67,18.43,4.83l0.87,0.49
	l-0.98,1.74l-0.87-0.49c-5.32-2.99-11.35-4.57-17.45-4.57c-20.2,0-36.63,17.03-36.63,37.95s16.43,37.95,36.63,37.95
	s36.63-17.03,36.63-37.95c0-4.72-0.83-9.32-2.45-13.69l-0.35-0.94l1.87-0.7l0.35,0.94c1.71,4.59,2.58,9.43,2.58,14.38
	C128.22,266.78,110.89,284.7,89.59,284.7z"
      />
      <path
        className={`st4 ${imageClass}`}
        d="M89.59,253.13c-4.48,0-8.12-3.76-8.12-8.38s3.64-8.38,8.12-8.38s8.12,3.76,8.12,8.38S94.06,253.13,89.59,253.13
	z M89.59,237.87c-3.65,0-6.62,3.09-6.62,6.88s2.97,6.88,6.62,6.88s6.62-3.09,6.62-6.88S93.24,237.87,89.59,237.87z"
      />
      <path
        className={`st4 ${imageClass}`}
        d="M171.15,267.51h-15.66c-0.29,0-0.56-0.12-0.75-0.33c-0.19-0.21-0.28-0.5-0.25-0.78
	c0.01-0.06,0.71-6.54-1.31-13.42c-2.66-9.06-8.59-14.5-17.61-16.2l-0.98-0.18l0.37-1.97l0.98,0.18
	c20.69,3.88,20.88,25.51,20.62,30.69h13.76c3.9-20.42,1.18-35.62-8.09-45.17c-14.68-15.12-41.12-10.9-41.39-10.86l-0.99,0.17
	l-0.33-1.97l0.99-0.17c0.28-0.05,6.99-1.14,15.69-0.31c11.58,1.11,21.07,5.17,27.46,11.75c9.88,10.18,12.72,26.25,8.46,47.76
	C172.03,267.17,171.62,267.51,171.15,267.51z"
      />
      <path
        className={`st4 ${imageClass}`}
        d="M171.18,266.1l-0.04-2l11.51-0.21c1.75-17.07-1.39-30.43-9.33-39.73c-10.4-12.17-25.66-13-25.81-13l-1-0.04
	l0.09-2l1,0.04c0.66,0.03,16.25,0.85,27.23,13.68c8.47,9.89,11.74,24.07,9.72,42.14c-0.06,0.5-0.47,0.88-0.98,0.89L171.18,266.1z"
      />
      <g>
        <ellipse
          className={`st2 ${imageClass}`}
          cx="149.44"
          cy="279.61"
          rx="12.69"
          ry="13.14"
        />
        <path
          className={`st4 ${imageClass}`}
          d="M149.44,293.75c-7.55,0-13.69-6.34-13.69-14.14c0-7.8,6.14-14.14,13.69-14.14c7.55,0,13.69,6.34,13.69,14.14
		C163.14,287.41,156.99,293.75,149.44,293.75z M149.44,267.47c-6.45,0-11.69,5.45-11.69,12.14s5.24,12.14,11.69,12.14
		s11.69-5.44,11.69-12.14S155.89,267.47,149.44,267.47z"
        />
      </g>
      <path
        className={`st4 ${imageClass}`}
        d="M149.44,286.84c-3.87,0-7.01-3.24-7.01-7.23s3.15-7.23,7.01-7.23s7.01,3.24,7.01,7.23
	S153.31,286.84,149.44,286.84z M149.44,273.88c-3.04,0-5.51,2.57-5.51,5.73s2.47,5.73,5.51,5.73s5.51-2.57,5.51-5.73
	S152.48,273.88,149.44,273.88z"
      />
      <g>
        <path
          className={`st2 ${imageClass}`}
          d="M124.98,157.49c0,0-1.12,27.05,4.58,49.83"
        />
        <path
          className={`st4 ${imageClass}`}
          d="M128.82,208.54l-0.24-0.97c-5.66-22.66-4.62-49.84-4.6-50.11l0.04-1l2,0.08l-0.04,1
		c-0.01,0.27-1.05,27.17,4.55,49.55l0.24,0.97L128.82,208.54z"
        />
      </g>
      <path
        className={`st4 ${imageClass}`}
        d="M132.5,162.56c-0.19,0-0.39-0.06-0.55-0.17l-7.47-4.95l1.1-1.67l6.52,4.32l6.24-12.89l1.8,0.87L133.4,162
	c-0.13,0.26-0.36,0.45-0.64,0.53C132.68,162.55,132.59,162.56,132.5,162.56z"
      />
      <path
        className={`st4 ${imageClass}`}
        d="M116.64,164.19c-0.07,0-0.13-0.01-0.2-0.02c-0.31-0.06-0.57-0.27-0.71-0.56l-6.12-13.11l1.81-0.85l5.55,11.89
	l7.14-6.4l1.34,1.49l-8.14,7.3C117.12,164.1,116.88,164.19,116.64,164.19z"
      />
      <path
        className={`st4 ${imageClass}`}
        d="M89.51,197.75l-1.94-0.47l0.24-0.97c0.17-0.69,4.12-16.85,6.39-21.18l0.46-0.89l1.77,0.93l-0.46,0.89
	c-2.16,4.11-6.18,20.56-6.22,20.72L89.51,197.75z"
      />
      <rect
        x="85.84"
        y="166.63"
        transform="matrix(0.7446 -0.6675 0.6675 0.7446 -95.105 102.8339)"
        className={`st4 ${imageClass}`}
        width="2"
        height="18.15"
      />
      <rect
        x="88.84"
        y="258.2"
        className={`st4 ${imageClass}`}
        width="1.5"
        height="16.42"
      />
      <rect
        x="68.21"
        y="224.31"
        transform="matrix(0.5832 -0.8123 0.8123 0.5832 -158.0473 151.8604)"
        className={`st4 ${imageClass}`}
        width="1.5"
        height="11.26"
      />
      <path
        className={`st2 ${imageClass}`}
        d="M261.16,80.34c0,0,1.53,16.37,18.81,15.86c0.31,0,11.03-1.29,13.65-13.31c0,0,4.75-0.44,4.81-5.57
	c0.05-5.13-6.15-6.14-6.15-6.14s-2.4,2.15-7.13,1.16c-4.73-0.99-7.16-3.94-7.16-3.94s-3.06,6.31-6.11,9.2S261.16,80.34,261.16,80.34
	z"
      />
      <path
        className={`st4 ${imageClass}`}
        d="M232.74,133.9l-0.13-0.99c-1.68-12.66-0.36-21.43-0.3-21.79c0.05-0.33,0.27-0.62,0.58-0.76l12.05-5.45
	l0.82,1.82l-11.54,5.22c-0.25,2.08-1.03,10.06,0.38,20.7l0.13,0.99L232.74,133.9z"
      />
      <path
        className={`st4 ${imageClass}`}
        d="M278.28,97.18c-0.18,0-0.36,0-0.55-0.01c-9.91-0.3-17.67-8.41-17.67-18.47c0-10.19,7.94-18.47,17.7-18.47
	c6.84,0,13.06,4.12,15.99,10.54c3.14,0.07,5.68,2.99,5.68,6.57c0,3.33-2.2,6.08-5.04,6.51C293.5,86.7,289.45,97.18,278.28,97.18z
	 M262.31,81.63c1.32,7.57,7.64,13.3,15.48,13.54c4.85,0.15,8.84-1.88,11.8-6.02c2.26-3.17,3.06-6.45,3.07-6.48
	c0.11-0.45,0.51-0.77,0.97-0.77c2.1,0,3.81-2.05,3.81-4.57c0-2.47-1.64-4.49-3.68-4.57c-1.29,0.33-10.03,2.33-15.46-2.6
	c-1.87,3.82-6.76,11.47-15.96,11.47C262.33,81.63,262.32,81.63,262.31,81.63z M262.09,79.63c0.08,0,0.15,0,0.23,0
	c9.13,0,13.54-8.73,14.69-11.47c0.33-0.78,0.89-0.8,1.18-0.73c0.22,0.04,0.43,0.17,0.57,0.34c3.53,4.26,9.94,3.85,12.95,3.36
	c-2.68-5.44-8.06-8.91-13.95-8.91c-8.66,0-15.7,7.39-15.7,16.47C262.06,79.01,262.07,79.32,262.09,79.63z"
      />
      <g>
        <path
          className={`st2 ${imageClass}`}
          d="M297.13,127.75h-10.51c-0.64,0-1.15-0.52-1.15-1.15v-10.51c0-0.64,0.52-1.15,1.15-1.15h10.51
		c0.64,0,1.15,0.52,1.15,1.15v10.51C298.28,127.23,297.76,127.75,297.13,127.75z"
        />
        <path
          className={`st4 ${imageClass}`}
          d="M297.13,128.5h-10.51c-1.05,0-1.9-0.85-1.9-1.9v-10.51c0-1.05,0.85-1.9,1.9-1.9h10.51c1.05,0,1.9,0.85,1.9,1.9
		v10.51C299.03,127.64,298.18,128.5,297.13,128.5z M286.62,115.68c-0.22,0-0.4,0.18-0.4,0.4v10.51c0,0.22,0.18,0.4,0.4,0.4h10.51
		c0.22,0,0.4-0.18,0.4-0.4v-10.51c0-0.22-0.18-0.4-0.4-0.4H286.62z"
        />
      </g>
      <rect
        x="284.85"
        y="123.54"
        transform="matrix(0.9844 -0.1758 0.1758 0.9844 -17.3032 53.2509)"
        className={`st4 ${imageClass}`}
        width="14.13"
        height="1.5"
      />
      <path
        className={`st4 ${imageClass}`}
        d="M295.37,123.83l-0.03-0.75c-0.21-6.07-4.27-7.14-4.31-7.15l-0.73-0.18l0.36-1.46l0.73,0.18
	c0.21,0.05,5.21,1.36,5.45,8.56l0.03,0.75L295.37,123.83z"
      />
      <path
        className={`st4 ${imageClass}`}
        d="M131.25,175.84c-0.35,0-0.56-0.01-0.6-0.01l-0.75-0.03l0.05-1.5l0.75,0.02c0.05,0.01,5.27,0.16,9.7-1.32
	l0.71-0.24l0.47,1.42l-0.71,0.24C137.04,175.72,132.8,175.84,131.25,175.84z"
      />
    </svg>
  );
};

export default ContactUs;