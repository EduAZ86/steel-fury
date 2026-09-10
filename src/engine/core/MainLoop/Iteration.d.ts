export interface updateIteration {
    movementOfEntities: () => void;
    collisionHandler: () => void;
    updateState: () => void;
    updatePhysics: () => void;
    inputsHandler: () => void;
    updateIA: () => void;
    syncMultiplayerState?: () => void
}

export interface drawIteration {
    drawEntities: () => void;
    drawMap: () => void;
    drawEntitiesState: () => void;
    drawEffects: () => void;

}