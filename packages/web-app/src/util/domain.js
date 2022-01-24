import {Public, PublicOff} from "@mui/icons-material";

export function createVisibilityAction(entity, unpublish, publish) {
    if (['waitlist', 'public'].includes(entity.visibility)) {
        return {
            label: "Unpublish",
            icon: <PublicOff fontSize="small"/>,
            onClick: () => unpublish(entity._id)
        }
    } else {
        return {
            label: "Publish",
            icon: <Public fontSize="small"/>,
            onClick: () => publish(entity._id)
        }
    }
}