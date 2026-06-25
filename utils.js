
const _ = require("lodash");

/*
=====================================
SORT HELPER
=====================================
Sorts an array of objects.

Parameters:
data   - array to sort
sortBy - object property to sort by
order  - "asc" or "desc"
*/

const sort = (data, sortBy, order) => {

    // Create a new array sorted
    // in ascending order
    const sortedData = _.sortBy(data, sortBy);

    // Reverse the array if the
    // user requested descending order
    if (order === "desc") {
        sortedData.reverse();
    }

    // Return the sorted results
    return sortedData;
}

//Export
module.exports = sort;