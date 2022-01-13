import {CreateProductPage} from "./CreateProductPage";
import {Fab} from "@mui/material";
import {Add, Delete, Edit, Public} from "@mui/icons-material";
import {useContext, useState} from "react";
import {DataContext, NewtritionClientContext} from "../../App";
import CardsList from "../../component/CardsList";
import ProductCard from "../../component/ProductCard";
import {CardMenu} from "../../component/CardItem";
import BottomSheet from "../../component/BottomSheet";

export function ManageProductsPage() {
    const [editingProduct, setEditingProduct] = useState(null)
    const client = useContext(NewtritionClientContext);
    const [products, invalidateProducts] = useContext(DataContext).products;

    function editProduct(id) {
        client.products.byId(id).delete().then(() => invalidateProducts())
    }

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
                            onClick: () => editProduct(product._id)
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
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-end',
            flex: 1,
            position: 'absolute',
            bottom: 0
        }}>
            {editingProduct ?
                <BottomSheet title={editingProduct?._id ? "Edit product" : "New product"} visible={editingProduct}
                             onDismiss={() => setEditingProduct(null)}>
                    <CreateProductPage product={editingProduct}/>
                </BottomSheet> : <div/>}

        </div>
        <Fab color={'primary'} variant={"extended"} sx={{mr: 1}}
             style={{position: 'absolute', right: 20, bottom: 20}} onClick={() => setEditingProduct({})}>
            <Add/> New product
        </Fab>
    </div>
}
