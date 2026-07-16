export { MainLoop } from './core/MainLoop/mainLoop';
export { DeltaTime } from './core/MainLoop/deltaTime';
export type { updateIteration, drawIteration } from './core/MainLoop/Iteration';

export { Entity } from './core/EntitySystem/Entity';
export { GameObject } from './core/EntitySystem/gameObject';
export { Transform } from './core/EntitySystem/transform';
export { RigidBody2D } from './core/EntitySystem/rigidBody2D';
export { Vector2D } from './core/EntitySystem/geometry/Vector2D';
export { SquareShape } from './core/EntitySystem/geometry/ColissionSquareShape';
export type { bodyType, magnitudes, Iposition, Isize, CollisionData } from './core/EntitySystem/types';

export { Collision2D } from './core/Collision2D/Collision2D';
export type { collisionFace, verticesSquare } from './core/Collision2D/types';

export { CanvasHandler } from './core/Render/canvasHandler';
export { SpriteRenderer } from './core/Render/spritesRender';
export { AssetLoader } from './core/Render/AssetLoader';
export { RenderSystem } from './core/Render/RenderSystem';
export type { IRenderable, IMapDataProvider, IGameRenderer } from './core/Render/RenderSystem';
export type { DrawSpriteOptions, DrawRectOptions, DrawTextOptions, DrawCircleOptions } from './core/Render/types';

export { Inputs } from './core/Input/Input';
export { ArrowSpaceEnterEscKeys } from './core/Input/ArrowSpaceEnterKeys';
export type { keys } from './core/Input/ArrowSpaceEnterKeys';
export { MouseInput } from './core/Input/Mouse';
export type { InputsDevice } from './core/Input/types';

export { ScreenSize } from './core/Screen/screenSize.class';
export type { ResizeCallback } from './core/Screen/screenSize.class';
