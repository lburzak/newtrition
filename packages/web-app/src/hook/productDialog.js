import BottomSheet from "../component/BottomSheet";
import {Fragment, useState} from "react";
import {CreateProductPage} from "../page/product/CreateProductPage";

export default function useProductDialog() {
    const [editingProduct, setEditingProduct] = useState(null)
    const dialog = <ProductDialog editingProduct={editingProduct} setEditingProduct={setEditingProduct}/>
    return [dialog, setEditingProduct];
}

function ProductDialog({editingProduct, setEditingProduct}) {
    return editingProduct ?
        <AbsolutePosition>
            <BottomSheet title={editingProduct?._id ? "Edit product" : "New product"}
                         visible={editingProduct}
                         onDismiss={() => setEditingProduct(null)}>
                <CreateProductPage product={editingProduct}/>
            </BottomSheet>
        </AbsolutePosition> : <Fragment/>
}

function AbsolutePosition({children}) {
    return <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end',
        flex: 1,
        position: 'absolute',
        bottom: 0
    }}>
        {children}
    </div>
}