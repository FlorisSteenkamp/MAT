---
sidebar_position: 1
---



```typescript

  findMats,
	toScaleAxis,
  trimMat,
  traverseVertices,
	traverseEdges,
	getBranches,
	getBoundaryBeziersToNext,
	getBoundaryBezierPartsToNext,

	Mat,
	PointOnShape,
	Curve,
	Loop,
	CpNode,
	Circle,
	ContactPoint,
	BezierPiece,

	simplifyMat,

	// CpNode
	getChildren,
	vertexChildren,
	getAllOnLoop,
	getCpNodesOnCircle,
	isOnSameCircle,
	isTerminating,
	isFullyTerminating,
	getFirstExit,
	isSharp,
	getProngCount,
	getRealProngCount,
	cpNodeComparator,
	removeCpNode,
	enhanceCpNode,
	traverseCp,
  getCurveToNext,
  getCurveBetween,


	// SVG functions
	beziersToSvgPathStr,
	getPathsFromStr,
	getShapeBounds,
	drawBranch,
	drawMat,
```


```typescript
function intersectBoxes(a: number[][], b: number[][]): number[][] | undefined
```

*Defined in [boxes/intersect-boxes.ts:18](https://github.com/FlorisSteenkamp/FloBezier/blob/a2fe14d/src/boxes/intersect-boxes.ts#L18)*

Returns the intersection of 2 given axis-aligned rectangular boxes (or
`undefined` if they don't intersect).
* **exact**: not susceptible to floating point round-off
* **closed**: interpret boxes as being closed (i.e. they contain their border).



#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`a` | number[][] | an axis-aligned rectangular box (given by an array of two points, e.g. `[[1,2], [3,4]]`)    |
`b` | number[][] | another box     |


