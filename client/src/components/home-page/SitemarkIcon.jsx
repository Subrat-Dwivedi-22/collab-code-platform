import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

export default function SitemarkIcon() {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        mr: 0.5,
      }}
    >
      {/* </> LOGO */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mr: 1,
          fontWeight: 800,
          fontSize: "1.1rem",
          lineHeight: 1,
          letterSpacing: "-1px",
          userSelect: "none",
        }}
      >
        <Box
          component="span"
          sx={{
            color: "primary.main",
          }}
        >
          {"<"}
        </Box>

        <Box
          component="span"
          sx={{
            color: "common.white",
            mx: "1px",
          }}
        >
          /
        </Box>

        <Box
          component="span"
          sx={{
            color: "primary.main",
          }}
        >
          {">"}
        </Box>
      </Box>

      {/* TEXT */}
      <Typography
        sx={{
          fontSize: "1.15rem",
          fontWeight: 700,
          letterSpacing: "-0.4px",
          lineHeight: 1,
          color: "text.primary",

          "& span": {
            color: "primary.main",
          },
        }}
      >
        Code<span>Sync</span>
      </Typography>
    </Box>
  );
}