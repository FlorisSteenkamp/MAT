## Polyfill for SVG 2 getPathData() and setPathData() methods

**Based on**:
- SVGPathSeg polyfill by Philip Rogers (MIT License)
  https://github.com/progers/pathseg
- SVGPathNormalizer by Tadahisa Motooka (MIT License)
  https://github.com/motooka/SVGPathNormalizer/tree/master/src
- arcToCubicCurves() by Dmitry Baranovskiy (MIT License)
  https://github.com/DmitryBaranovskiy/raphael/blob/v2.1.1/dev/raphael.core.js#L1837

**More info**:
- https://svgwg.org/specs/paths/#InterfaceSVGPathData
- https://lists.w3.org/Archives/Public/www-svg/2015Feb/0036.html
- https://groups.google.com/a/chromium.org/forum/#!searchin/blink-dev/pathSegList/blink-dev/EDC3cBg9mCU/Ukhx2UXmCgAJ
- https://code.google.com/p/chromium/issues/detail?id=539385
- https://code.google.com/p/chromium/issues/detail?id=545467

## Usage

### Print each path segment to console

```js
let logPathSegments = (path) => {
  for (let seg of path.getPathData()) {
    if (seg.type === "M") {
      let [x, y] = seg.values;
      console.log(`M ${x} ${y}`);
    }
    else if (seg.type === "L") {
      let [x, y] = seg.values;
      console.log(`L ${x} ${y}`);
    }
    else if (seg.type === "C") {
      let [x1, y1, x2, y2, x, y] = seg.values;
      console.log(`C ${x1} ${y1} ${x2}, ${y2}, ${x} ${y}`);
    }
    ...
  }
};
```

### Create a triangle path

```js

let createTrianglePath = (x = 0, y = 0, width = 100, height = 200) => {
  let path = document.createElementNS("http://www.w3.org/2000/svg", "path");

  let pathData = [
    { type: "M", values: [x + (width / 2), y] },
    { type: "L", values: [x + width, y + height] },
    { type: "L", values: [x, y + height] },
    { type: "Z"}
  ];

  path.setPathData(pathData);
  return path;
};
```

### Convert an ellipse to a path

```js
let ellipseToPath = (ellipse) => {
  let path = document.createElementNS("http://www.w3.org/2000/svg", "path");

  for (let attribute of ellipse.attributes) {
    if (!["cx", "cy", "rx", "ry"].includes(attribute.name)) {
      path.setAttribute(attribute.name, attribute.value);
    }
  }

  let cx = ellipse.cx.baseVal.value;
  let cy = ellipse.cy.baseVal.value;
  let rx = ellipse.rx.baseVal.value;
  let ry = ellipse.ry.baseVal.value;

  let pathData = [
    {type: "M", values: [cx, cy - ry]},
    {type: "A", values: [rx, ry, 0, 0, 0, cx, cy+ry]},
    {type: "A", values: [rx, ry, 0, 0, 0, cx, cy-ry]},
    {type: "Z"}
  ];
  
  path.setPathData(pathData);
  return path;
};
```

### Normalize a path to "M", "L", "C" and "Z" segments

```js
let normalizePath = (path) => {
  let normalizedPathData = path.getPathData({normalize: true});
  path.setPathData(normalizedPathData);
};
```
