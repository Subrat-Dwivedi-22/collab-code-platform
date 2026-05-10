import SvgIcon from '@mui/material/SvgIcon';
import { SquareChevronRight } from 'lucide-react';

export default function SitemarkIcon() {
  return (
    <SvgIcon sx={{ height: 21, width: 100, mr: 2 }}>
      <svg width={86} height={19} viewBox="0 0 86 19" fill="none">
        <SquareChevronRight />
      </svg>
    </SvgIcon>
  );
}
