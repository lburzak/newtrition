import {getDefaultProductPhoto, randomPlaceholderGenerator} from "../util/photo";
import {CardItem} from "./CardItem";

export default function ProductCard({product, menu, generatePhoto = randomPlaceholderGenerator()}) {
    return <CardItem
        name={product.name}
        calories={product.nutritionFacts.calories}
        proteins={product.nutritionFacts.protein}
        carbohydrates={product.nutritionFacts.carbohydrate}
        ean={product.ean}
        visibility={product.visibility}
        imageSrc={product.photosCount > 0 ? getDefaultProductPhoto(product._id) : generatePhoto(product.name)}
        menu={menu}
    />
}