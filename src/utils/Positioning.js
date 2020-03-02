
// converts vectors to string and applies scale and offset for each
export const convertVectorArrayToPointsString = (area, offset) => {
    var result = "";
    for (var i = 0; i < area.length; i++) {
        var point = area[i];
        if (i !== 0) {
            result = result + ",";   
        }
        result = result + (point.x + offset.x) + " " + (point.y + offset.y)
    }

    return result;
};

export const getPositionWithOffset = (position, offset) => {
    let result = {
        x: position.x + offset.x,
        y: position.y + offset.y
    }
    return result;
};

// searches for highest x and y coords, applies offset afterwards
export const getRightBottomCorner = (area, offset) => {
    let correction = 5;

    let coords = {
        x: 0,
        y: 0
    }

    for (var i = 0; i < area.length; i++) {
        if (area[i].x > coords.x) {
            coords.x = area[i].x;
        }

        if (area[i].y > coords.y) {
            coords.y = area[i].y;
        }
    }

    coords.x = coords.x + offset.x - correction;
    coords.y = coords.y + offset.y - correction;

    return coords
};

export const getLeftBottomCorner = (area, offset) => {
    let correction = 0;

    let coords = {
        x: -1,
        y: -1
    }

    for (var i = 0; i < area.length; i++) {
        if (coords.x === -1 || area[i].x < coords.x) {
            coords.x = area[i].x;
        }

        if (coords.y === -1 || area[i].y > coords.y) {
            coords.y = area[i].y;
        }
    }

    coords.x = coords.x + offset.x - correction;
    coords.y = coords.y + offset.y - correction;

    return coords
};

export const getOrigin = (area, offset) => {
    let coords = {
        x: -1,
        y: -1
    }

    for (var i = 0; i < area.length; i++) {
        if (coords.x === -1 || area[i].x < coords.x) {
            coords.x = area[i].x;
        }

        if (coords.y === -1 || area[i].y < coords.y) {
            coords.y = area[i].y;
        }
    }

    coords.x = coords.x + offset.x;
    coords.y = coords.y + offset.y;

    return coords
};
