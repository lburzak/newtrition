import {getDefaultProductPhoto, randomPlaceholderGenerator} from "../util/photo";
import {CardItem, Spec} from "./CardItem";

export default function ProductCard({product, menu, generatePhoto = randomPlaceholderGenerator()}) {
    const {calories, proteins, carbohydrates} = product.nutritionFacts
    return <CardItem
        name={product.name}
        ean={product.ean}
        visibility={product.visibility}
        imageSrc={product.photosCount > 0 ? getDefaultProductPhoto(product._id) : generatePhoto(product.name)}
        menu={menu}>
        <Spec name={'Calories'} value={calories}/>
        <Spec name={'Proteins'} value={proteins}/>
        <Spec name={'Carbs'} value={carbohydrates}/>
    </CardItem>
}