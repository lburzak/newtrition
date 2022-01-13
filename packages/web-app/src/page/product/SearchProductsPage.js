import CardsList from "../../component/CardsList";
import {useContext, useEffect, useState} from "react";
import {NewtritionClientContext} from "../../App";
import {getDefaultProductPhoto} from "../../util/photo";
import {CardItem} from "../../component/CardItem";

export default function SearchProductsPage() {
    const [products, setProducts] = useState([])
    const [status, setStatus] = useState('initial');
    const client = useContext(NewtritionClientContext)

    useEffect(() => {
        if (status === 'initial') {
            setStatus('fetching')
            client.products.get({visible: true})
                .then(result => {
                    setProducts(result.data)
                    setStatus('fetched')
                })
        }
    }, [client, setProducts, status])

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
            />)
        }
    </CardsList>
}