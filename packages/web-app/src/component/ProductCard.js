import {getDefaultProductPhoto, randomPlaceholderGenerator} from "../util/photo";
import {CardItem, Spec} from "./CardItem";

export default function ProductCard({product, menu, generatePhoto = randomPlaceholderGenerator()}) {
    const {calories, protein, fat, carbohydrate} = product.nutritionFacts
    return <CardItem
        name={product.name}
        ean={product.ean}
        visibility={product.visibility}
        imageSrc={product.photosCount > 0 ? getDefaultProductPhoto(product._id) : generatePhoto(product.name)}
        menu={menu}>
        <Spec name={'Calories'} value={calories}/>
        <Spec name={'Proteins'} value={protein}/>
        <Spec name={'Fat'} value={fat}/>
        <Spec name={'Carbs'} value={carbohydrate}/>
    </CardItem>
}