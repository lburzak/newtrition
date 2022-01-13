

function makeQuery({visibility, visible, username}) {
    const visiblePredicate = {
        $or: [
            {visibility: 'public'},
            {owner: username}
        ]
    };

    const visibilityPredicate = {
        visibility: visibility
    }

    const predicates = [];

    if (visible)
        predicates.push(visiblePredicate)

    if (visibility)
        predicates.push(visibilityPredicate)

    return {
        $and: predicates
    }
}

module.exports = {
    makeQuery
}