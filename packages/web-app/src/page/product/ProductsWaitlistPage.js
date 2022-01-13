import CardsList from "../../component/CardsList";
import {useContext, useEffect, useState} from "react";
import {DataContext, NewtritionClientContext} from "../../App";
import {getDefaultProductPhoto} from "../../util/photo";
import {CardItem} from "../../component/CardItem";

export default function ProductsWaitlistPage() {
    const [products, setProducts] = useState([])
    const client = useContext(NewtritionClientContext)
    const [, invalidateProducts] = useContext(DataContext).products;

    useEffect(() => {
        client.products.get({visibility: 'waitlist'})
            .then(result => setProducts(result.data))
    }, [client, products, setProducts])

    return <CardsList>
        {
            products.map((product, index) => <CardItem
                key={`product-${index}`}
                name={product.name}
                calories={product.nutritionFacts.calories}
                proteins={product.nutritionFacts.protein}
                carbohydrates={product.nutritionFacts.carbohydrate}
                ean={product.ean}
                visibility={product.visibility}
                imageSrc={product.photosCount > 0 ? getDefaultProductPhoto(product._id) : undefined}
                onPublish={() => client.products.byId(product._id).patch({visibility: 'public'})
                    .then(() => invalidateProducts())}
            />)
        }
    </CardsList>
}