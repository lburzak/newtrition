import {
    Button,
    FormControl,
    FormHelperText,
    Grid,
    InputAdornment,
    TextField,
    OutlinedInput, Autocomplete
} from "@mui/material";
import {useContext, useEffect, useReducer} from "react";
import {ProductsApi} from "../api/index";
import Message from "../form/message"
import {DataContext} from "../App";

const initialState = {
    fields: {
        name: '',
        ean: '',
        calories: '',
        protein: '',
        carbohydrate: '',
        fat: ''
    },
    errors: {},
    submitted: false
}

const DetailInput = ({name, unit, onChange}) => <FormControl variant="outlined">
    <FormHelperText>{name}</FormHelperText>
    <OutlinedInput
        fullWidth
        endAdornment={<InputAdornment position="end">{unit}</InputAdornment>}
        inputProps={{inputMode: 'decimal', pattern: '[0-9]*'}}
        onChange={onChange}
    />
</FormControl>

export function CreateProductPage() {
    const [state, dispatch] = useReducer(reducer, initialState);
    const data = useContext(DataContext);
    const [, invalidateProducts] = data.products;
    const [classes, invalidateClasses] = data.classes;

    const buildFieldChangeHandler = (fieldName) => event => dispatch({
        type: 'updateField',
        payload: {
            field: fieldName,
            content: event.target.value
        }
    });

    useEffect(() => {
        if (state.submitted) {
            ProductsApi.Endpoint.createProduct({
                name: state.fields.name,
                ean: state.fields.ean,
                calories: state.fields.calories,
                carbohydrate: state.fields.carbohydrate,
                fat: state.fields.fat,
                protein: state.fields.protein,
                classes: state.fields.classes
            }).then(result => {
                dispatch({type: 'submitFinished'})
                if (result.error === ProductsApi.Error.VALIDATION_FAILED)
                    dispatch({type: 'showValidationErrors', payload: result.payload.validationErrors})
                invalidateProducts()
                invalidateClasses()
            })
        }
    }, [dispatch, invalidateProducts, state, invalidateClasses]);

    return <form style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%'}}
                 onSubmit={e => {
                     e.preventDefault();
                     dispatch({type: 'submit'});
                 }}>

        <Grid container spacing={2}>
            <Grid item xs={6} md={8}>
                <TextField fullWidth label={"Product name"} variant={"outlined"}
                           onChange={buildFieldChangeHandler('name')}/>
            </Grid>
            <Grid item xs={6} md={4}>
                <TextField fullWidth label={"EAN Code"} variant={"outlined"} onChange={buildFieldChangeHandler('ean')}
                           error={state.errors['ean'] !== undefined} helperText={state.errors['ean']}/>
            </Grid>
            <Grid item xs={3}>
                <DetailInput name="Calories per 100g" unit="kcal" onChange={buildFieldChangeHandler('calories')}/>
            </Grid>
            <Grid item xs={3}>
                <DetailInput name="Proteins per 100g" unit="grams" onChange={buildFieldChangeHandler('protein')}/>
            </Grid>
            <Grid item xs={3}>
                <DetailInput name="Carbohydrates per 100g" unit="grams"
                             onChange={buildFieldChangeHandler('carbohydrate')}/>
            </Grid>
            <Grid item xs={3}>
                <DetailInput name="Fat per 100g" unit="grams" onChange={buildFieldChangeHandler('fat')}/>
            </Grid>
            <Grid item xs={12}>
                <Autocomplete
                    multiple
                    freeSolo
                    options={classes}
                    onChange={(event, value) => dispatch({type: 'updateField', payload: {field: 'classes', content: value}})}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Product classes"
                        />
                    )}
                />
            </Grid>
        </Grid>

        <Button fullWidth variant={"contained"} type={"submit"}>Save</Button>
    </form>;
}

function reducer(state, action) {
    switch (action.type) {
        case 'submit':
            return {
                ...state,
                errors: {},
                submitted: true
            }
        case 'submitFinished':
            return {
                ...state,
                submitted: false
            }
        case 'updateField':
            const newState = {
                ...state,
                fields: {
                    ...state.fields
                }
            };

            newState.fields[action.payload.field] = action.payload.content;

            console.log(newState)

            return newState;
        case 'showValidationErrors':
            const errors = {}
            action.payload.forEach(validationError => {
                errors[validationError.field] = Message.fromValidationError(validationError);
            })
            return {
                ...state,
                errors
            }
        default:
            return state;
    }
}