import {DataGrid} from '@mui/x-data-grid';
import {Button} from "@mui/material";
import {Close, Done, Visibility} from "@mui/icons-material";

export default function Waitlist({items, onShow, onAccept, onDecline}) {
    function ActionsCell({id}) {
        return <div style={{width: '100%', display: 'flex'}}>
            <Button onClick={() => onShow(id)} style={{flex: 1}} fullWidth color={"info"}><Visibility/></Button>
            <Button onClick={() => onAccept(id)} style={{flex: 1}} fullWidth color={"success"}><Done/></Button>
            <Button onClick={() => onDecline(id)} style={{flex: 1}} fullWidth color={"error"}><Close/></Button>
        </div>
    }

    const columns = [
        { field: 'id', headerName: 'Id', flex: 1 },
        { field: 'name', headerName: 'Name', flex: 1 },
        { field: 'owner', headerName: 'Author', flex: 1 },
        { field: 'action', headerName: 'Action', flex: 1, renderCell: ({row}) => <ActionsCell id={row.id}/> }
    ];

    return <div style={{ display: 'flex', width: '100%' }}>
        <div style={{ flexGrow: 1 }}>
            <DataGrid rows={items.map(item => {
                item.id = item._id
                return item
            })} columns={columns}/>
        </div>
    </div>
}