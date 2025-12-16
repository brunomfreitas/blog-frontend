import SvgIcon from '@mui/material/SvgIcon';

export default function SitemarkIcon() {
  return (
    <SvgIcon sx={{ height: 24, width: 120, mr: 2 }}>
      <svg viewBox="0 0 120 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Graduation cap */}
        <path
          d="M8 9L22 4l14 5-14 5L8 9Z"
          fill="#4876EE"
        />
        <path
          d="M12 12v4c0 1.1 4.5 2 10 2s10-.9 10-2v-4"
          fill="#4876EE"
          opacity="0.25"
        />
        <line x1="36" y1="9" x2="36" y2="15" stroke="#00D3AB" strokeWidth="2" />

        {/* Text */}
        <text
          x="50"
          y="16"
          fill="#4876EE"
          fontSize="12"
          fontFamily="Arial, Helvetica, sans-serif"
          fontWeight="700"
        >
          Blog
        </text>
      </svg>
    </SvgIcon>
  );
}
