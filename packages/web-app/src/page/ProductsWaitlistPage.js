import CardsList from "../component/CardsList";
import {getFirstPhotoUrl, ProductCard} from "./ProductsPage";
import {useContext, useEffect, useState} from "react";
import {NewtritionClientContext} from "../App";

export default function ProductsWaitlistPage() {
    const [products, setProducts] = useState([])
    const client = useContext(NewtritionClientContext)

    useEffect(() => {
        client.products.get({visibility: 'waitlist'})
            .then(result => setProducts(result.data))
    }, [client, products, setProducts])

    return <CardsList>
        {
            products.map((product, index) => <ProductCard
                key={`product-${index}`}
                name={product.name}
                calories={product.nutritionFacts.calories}
                proteins={product.nutritionFacts.protein}
                carbohydrates={product.nutritionFacts.carbohydrate}
                ean={product.ean}
                visibility={product.visibility}
                imageSrc={product.photosCount > 0 ? getFirstPhotoUrl(product._id) : undefined}
            />)
        }
    </CardsList>
}