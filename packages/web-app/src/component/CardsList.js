import {Grid} from "@mui/material";

export default function CardsList({children}) {
    return <div style={{overflowY: 'scroll', height: '100%', flex: 1}}>
        <div style={{padding: 20}}>
            <EvenGrid>
                {children}
            </EvenGrid>
        </div>
    </div>
}

const EvenGrid = ({children}) => <Grid container spacing={2}>
    {children.map((child, index) => <Grid key={`item-${index}`} item xs={12} sm={6} md={4} lg={3}>{child}</Grid>)}
</Grid>
