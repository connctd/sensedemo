
export const EventTypeMotionDetected = 1;

export const CoordinateRelationRelative = 1;
export const CoordinateRelationAbsolute = 2;

export const BuildMotionDetectedEvent = (coords, relation) => {
    return { type: EventTypeMotionDetected, coords: coords, relation: relation};
};

