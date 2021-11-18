import {
    Button,
    FormControl,
    FormHelperText,
    Grid,
    InputAdornment,
    Paper, TextField,
    Typography,
    OutlinedInput,
    IconButton
} from "@mui/material";
import {Close} from "@mui/icons-material";

const DetailInput = ({name, unit}) => <FormControl variant="outlined">
    <FormHelperText>{name}</FormHelperText>
    <OutlinedInput
        fullWidth
        endAdornment={<InputAdornment position="end">{unit}</InputAdornment>}
        inputProps={{ inputMode: 'decimal', pattern: '[0-9]*' }}
    />
</FormControl>

// TODO: Move `onClose` to a container for show/hide logic
export const CreateProductPage = ({onClose}) => {
    return <Paper elevation={4} style={{minHeight: 400, width: '90%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', paddingLeft: 40, paddingRight: 40, paddingBottom: 40}}>
        <div>
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                <Typography variant={'h6'} style={{margin: 20, color: 'hsl(0, 0%, 40%)', textAlign: 'start'}}>New product</Typography>
                <IconButton onClick={onClose}>
                    <Close style={{margin: 20, color: 'hsl(0, 0%, 40%)'}}/>
                </IconButton>
            </div>
            <Grid container spacing={2} separator>
                <Grid item xs={6} md={8}>
                    <TextField fullWidth label={"Product name"} variant={"outlined"}/>
                </Grid>
                <Grid item xs={6} md={4}>
                    <TextField fullWidth label={"EAN Code"} variant={"outlined"}/>
                </Grid>
                <Grid item xs={3}>
                    <DetailInput name="Calories per 100g" unit="kcal"/>
                </Grid>
                <Grid item xs={3}>
                    <DetailInput name="Proteins per 100g" unit="grams"/>
                </Grid>
                <Grid item xs={3}>
                    <DetailInput name="Carbohydrates per 100g" unit="grams"/>
                </Grid>
                <Grid item xs={3}>
                    <DetailInput name="Fat per 100g" unit="grams"/>
                </Grid>
            </Grid>
        </div>
        <Button fullWidth variant={"contained"} type={"submit"}>Save</Button>
    </Paper>
}