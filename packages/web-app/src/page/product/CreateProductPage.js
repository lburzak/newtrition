import {
    Autocomplete,
    Button,
    FormControl,
    FormHelperText,
    Grid,
    InputAdornment,
    OutlinedInput,
    TextField
} from "@mui/material";
import {useEffect, useReducer} from "react";
import Message from "../../form/message"
import {useClient} from "../../hook/client";
import PhotosSlider from "../../component/PhotosSlider";
import {convertJsonToFormData} from "../../util/formData";
import {range} from "../../util/range";
import {useRemoteData} from "../../hook/remoteData";

const initialState = {
    fields: {
        name: '',
        ean: '',
        calories: '',
        protein: '',
        carbohydrate: '',
        fat: ''
    },
    photos: [],
    errors: {},
    // 'initial' | 'submitted' | 'waiting'
    status: 'initial',
    classes: []
}

const DetailInput = ({name, unit, onChange, value}) => <FormControl variant="outlined">
    <FormHelperText>{name}</FormHelperText>
    <OutlinedInput
        fullWidth
        defaultValue={value}
        endAdornment={<InputAdornment position="end">{unit}</InputAdornment>}
        inputProps={{inputMode: 'decimal', pattern: '[0-9]*(\.[0.9]*)*'}}
        onChange={onChange}
    />
</FormControl>

function readProductFromInput(state) {
    const {name, calories, carbohydrate, fat, protein, ean} = state.fields;

    const product = {
        name,
        nutritionFacts: JSON.stringify({
            calories,
            carbohydrate,
            fat,
            protein
        }),
        classes: JSON.stringify(state.classes)
    };

    if (ean.length > 0)
        product.ean = ean

    const data = convertJsonToFormData(product);

    state.photos.forEach(photo => data.append('photos', photo))

    return data;
}

function stateFromProduct(product) {
    if (!product || !product._id)
        return initialState;

    return {
        fields: {
            name: product.name,
            ean: product.ean ?? "",
            calories: product.nutritionFacts.calories ?? "",
            protein: product.nutritionFacts.protein ?? "",
            carbohydrate: product.nutritionFacts.carbohydrate ?? "",
            fat: product.nutritionFacts.fat ?? ""
        },
        photos: range(product.photosCount).map(i => `/api/products/${product._id}/photos/${i}`),
        errors: {},
        // 'initial' | 'submitted' | 'waiting'
        status: 'initial',
        classes: product.classes
    }
}

export function CreateProductPage({product, onSubmit}) {
    const [state, dispatch] = useReducer(reducer, stateFromProduct(product));
    const client = useClient();
    const [classes] = useRemoteData(client.products.classes.get, []);
    const productExists = product._id;

    const buildFieldChangeHandler = (fieldName) => event => dispatch({
        type: 'updateField',
        payload: {
            field: fieldName,
            content: event.target.value
        }
    });

    useEffect(() => {
        if (state.status === 'submitted')
            processSubmission()

        function processSubmission() {
            dispatch({type: 'submitStarted'})
            const newProduct = readProductFromInput(state);

            const operation = productExists
                ? client.products.byId(product._id).put(newProduct)
                : client.users.self.products.create(newProduct)

            operation.then(onSubmit)
                .catch(handleFailure)
                .finally(() => dispatch({type: 'submitFinished'}))
        }

        function handleFailure(error) {
            if (error.response && error.response.status === 400) {
                dispatch({type: 'showValidationErrors', payload: error.response.data.errors})
            } else {
                console.error("Server did not respond")
            }
        }
    }, [dispatch, state, client, productExists, product, onSubmit]);

    return <form style={{display: 'flex', flexDirection: 'column', height: '100%', padding: 16}}
                 onSubmit={e => {
                     e.preventDefault();
                     dispatch({type: 'submit'});
                 }}>

        <div style={{paddingBottom: 16}}>
            <PhotosSlider defaultValue={state.photos}
                          onPhotoAdded={(file) => dispatch({type: 'addPhoto', payload: {file}})}
                          onPhotoChanged={(index, file) => dispatch({type: 'changePhoto', payload: {index, file}})}/>
        </div>

        <Grid container spacing={2}>
            <Grid item xs={6} md={8}>
                <TextField fullWidth label={"Product name"} variant={"outlined"} value={state.fields.name}
                           onChange={buildFieldChangeHandler('name')}/>
            </Grid>
            <Grid item xs={6} md={4}>
                <TextField fullWidth label={"EAN Code"} variant={"outlined"} value={state.fields.ean || ""}
                           onChange={buildFieldChangeHandler('ean')}
                           error={state.errors['ean'] !== undefined} helperText={state.errors['ean']}/>
            </Grid>
            <Grid item xs={3}>
                <DetailInput name="Calories per 100g" unit="kcal" value={state.fields.calories}
                             onChange={buildFieldChangeHandler('calories')}/>
            </Grid>
            <Grid item xs={3}>
                <DetailInput name="Proteins per 100g" unit="grams" value={state.fields.protein}
                             onChange={buildFieldChangeHandler('protein')}/>
            </Grid>
            <Grid item xs={3}>
                <DetailInput name="Carbohydrates per 100g" unit="grams" value={state.fields.carbohydrate}
                             onChange={buildFieldChangeHandler('carbohydrate')}/>
            </Grid>
            <Grid item xs={3}>
                <DetailInput name="Fat per 100g" unit="grams" value={state.fields.fat}
                             onChange={buildFieldChangeHandler('fat')}/>
            </Grid>
            <Grid item xs={12}>
                <Autocomplete
                    multiple
                    freeSolo
                    defaultValue={state.classes}
                    options={classes}
                    onChange={(event, value) => dispatch({
                        type: 'updateClasses',
                        payload: value
                    })}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Product classes"
                        />
                    )}
                />
            </Grid>
        </Grid>

        <Grid container spacing={2}>
            <Grid item md={10}/>
            <Grid item md={2}>
                <Button style={{marginTop: 16, height: 50}} fullWidth variant={"contained"}
                        type={"submit"}>Save</Button>
            </Grid>
        </Grid>
    </form>;
}

function reducer(state, action) {
    switch (action.type) {
        case 'submit':
            return {
                ...state,
                errors: {},
                status: 'submitted'
            }
        case 'submitFinished':
            return {
                ...state,
                status: 'initial'
            }
        case 'submitStarted':
            return {
                ...state,
                status: 'waiting'
            }
        case 'updateClasses':
            return {...state, classes: action.payload}
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
        case 'addPhoto':
            return {
                ...state,
                photos: [...state.photos, action.payload.file]
            }
        case 'changePhoto':
            const photos = [...state.photos];

            photos[action.payload.index] = action.payload.file
            return {
                ...state,
                photos
            }
        default:
            return state;
    }
}