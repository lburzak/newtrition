import CardsList from "../../component/CardsList";
import {getFirstPhotoUrl, ProductCard} from "./ManageProductsPage";
import {useContext, useEffect, useState} from "react";
import {DataContext, NewtritionClientContext} from "../../App";

export default function SearchProductsPage() {
    const [products, setProducts] = useState([])
    const [status, setStatus] = useState('initial');
    const client = useContext(NewtritionClientContext)
    const [, invalidateProducts] = useContext(DataContext).products;

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
            products.map((product, index) => <ProductCard
                key={`product-${index}`}
                name={product.name}
                calories={product.nutritionFacts.calories}
                proteins={product.nutritionFacts.protein}
                carbohydrates={product.nutritionFacts.carbohydrate}
                ean={product.ean}
                visibility={product.visibility}
                imageSrc={product.photosCount > 0 ? getFirstPhotoUrl(product._id) : undefined}
                onPublish={() => client.products.byId(product._id).patch({visibility: 'public'})
                    .then(() => invalidateProducts())}
            />)
        }
    </CardsList>
}