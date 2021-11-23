import {
    Button,
    FormControl,
    FormHelperText,
    Grid,
    InputAdornment,
    TextField,
    OutlinedInput
} from "@mui/material";

const DetailInput = ({name, unit}) => <FormControl variant="outlined">
    <FormHelperText>{name}</FormHelperText>
    <OutlinedInput
        fullWidth
        endAdornment={<InputAdornment position="end">{unit}</InputAdornment>}
        inputProps={{ inputMode: 'decimal', pattern: '[0-9]*' }}
    />
</FormControl>

export const CreateProductPage = () =>
    <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%'}}>
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

        <Button fullWidth variant={"contained"} type={"submit"}>Save</Button>
    </div>