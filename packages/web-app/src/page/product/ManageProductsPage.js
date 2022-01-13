import {CreateProductPage} from "./CreateProductPage";
import {
    Fab,
    IconButton,
    Paper,
    Typography
} from "@mui/material";
import {Add, Close, Delete, Edit, Public} from "@mui/icons-material";
import {useContext, useState} from "react";
import {DataContext, NewtritionClientContext} from "../../App";
import CardsList from "../../component/CardsList";
import ProductCard from "../../component/ProductCard";
import {CardMenu} from "../../component/CardItem";

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

const BottomSheet = ({title, visible, onDismiss, children}) =>
    <div style={{visibility: visible ? 'visible' : 'hidden', zIndex: 2, display: 'flex', justifyContent: 'center'}}>
        <Paper elevation={4} style={{
            minHeight: 400,
            width: '90%',
            paddingLeft: 40,
            paddingRight: 40,
            paddingBottom: 40,
            display: 'flex'
        }}>
            <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column'
            }}>
                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Typography variant={'h6'}
                                style={{margin: 20, color: 'hsl(0, 0%, 40%)', textAlign: 'start'}}>{title}</Typography>
                    <IconButton onClick={onDismiss}>
                        <Close style={{margin: 20, color: 'hsl(0, 0%, 40%)'}}/>
                    </IconButton>
                </div>
                <div style={{flex: 1}}>
                    {children}
                </div>
            </div>
        </Paper>
    </div>