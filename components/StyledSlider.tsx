import Slider from '@mui/material/Slider';
import { createTheme, ThemeProvider } from '@mui/material';

const theme = createTheme({
    components: {
        MuiSlider: {
            styleOverrides: {
                vertical: {
                    height: "auto"
                },
            },
        },
    },
});

type BrushProps = {
    brushSize: number,
    setBrushSize: (brushSize: number) => void
};

const StyledSlider = ({ brushSize, setBrushSize }: BrushProps) => {
    return (
        <ThemeProvider theme={theme}>
            <Slider
                marks={true}
                valueLabelDisplay='auto'
                orientation="vertical"
                min={0}
                max={15}
                value={brushSize}
                onChange={(_, v) => {
                    setBrushSize(v as number);
                }} />
        </ThemeProvider>
    )
}

export default StyledSlider