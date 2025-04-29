/*
 ----------------------------------------------------------------------------
 Developer: Ismail Hamzah
 Email: go2ismail@gmail.com
 ----------------------------------------------------------------------------
*/

function toCamelCase(str) {
    return str.charAt(0).toLowerCase() + str.slice(1);
}

export function useClientSideSorting(data, sortBy, sortDirection) {
    if (!sortBy || !data || !data.length) {
        return data;
    }

    const camelCaseSortBy = toCamelCase(sortBy);

    const sortedArray = [...data].sort((a, b) => {
        const aValue = a[camelCaseSortBy];
        const bValue = b[camelCaseSortBy];

        if (aValue === bValue) return 0;

        if (sortDirection === 'asc') {
            return aValue > bValue ? 1 : -1;
        } else {
            return aValue < bValue ? 1 : -1;
        }
    });

    return sortedArray;
}
