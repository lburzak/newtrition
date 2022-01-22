import {Fab} from "@mui/material";
import {Add, Delete, Edit, Public} from "@mui/icons-material";
import {useContext} from "react";
import {NewtritionClientContext} from "../../App";
import CardsList from "../../component/CardsList";
import ProductCard from "../../component/ProductCard";
import {CardMenu} from "../../component/CardItem";
import useProductDialog from "../../hook/productDialog";
import {useRemoteData} from "../../hook/remoteData";

export function ManageProductsPage() {
    const client = useContext(NewtritionClientContext);
    const [products, invalidateProducts] = useRemoteData(client.users.self.products.get, [])
    const [productDialog, showProduct] = useProductDialog({onFinish: invalidateProducts})

    function deleteProduct(id) {
        client.products.byId(id).delete().then(() => invalidateProducts())
    }

    function publishProduct(id) {
        client.products.byId(id).patch({visibility: 'waitlist'}).then(() => invalidateProducts())
    }

    return <div style={{display: 'flex', flexDirection: 'row', flex: 1}}>
        <CardsList>
            {
                products.map((product, index) => <ProductCard
                    key={`product-${index}`}
                    product={product}
                    menu={
                        <CardMenu items={[{
                            label: "Edit",
                            icon: <Edit fontSize="small"/>,
                            onClick: () => showProduct(product)
                        }, {
                            label: "Delete",
                            icon: <Delete fontSize="small"/>,
                            onClick: () => deleteProduct(product._id)
                        }, {
                            label: "Publish",
                            icon: <Public fontSize="small"/>,
                            onClick: () => publishProduct(product._id)
                        }]}/>
                    }/>)
            }
        </CardsList>
        {productDialog}
        <Fab color={'primary'} variant={"extended"} sx={{mr: 1}}
             style={{position: 'absolute', right: 20, bottom: 20}} onClick={() => showProduct({})}>
            <Add/> New product
        </Fab>
    </div>
}
