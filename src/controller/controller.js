
export function moveNinja(model, direction){
    model.ninjaMove(direction);
}

export function pickUpKey(model){
    model.pickUpKey();
}

export function changeLevel(model, level){
    model.initialize(level)
}