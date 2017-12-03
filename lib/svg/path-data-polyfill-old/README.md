### SVG path data polyfill

Implements getPathData() and setPathData() methods from SVG Paths spec. Does not rely on path.pathSegList API.

Based on:
- SVGPathSeg polyfill by Philip Rogers (MIT License)
  https://github.com/progers/pathseg
- SVGPathNormalizer by Tadahisa Motooka (MIT License)
  https://github.com/motooka/SVGPathNormalizer/tree/master/src
- arcToCubicCurves() by Dmitry Baranovskiy (MIT License)
  https://github.com/DmitryBaranovskiy/raphael/blob/v2.1.1/dev/raphael.core.js#L1837

More info:
- https://svgwg.org/specs/paths/#InterfaceSVGPathData
- https://lists.w3.org/Archives/Public/www-svg/2015Feb/0036.html
- https://groups.google.com/a/chromium.org/forum/#!searchin/blink-dev/pathSegList/blink-dev/EDC3cBg9mCU/Ukhx2UXmCgAJ
- https://code.google.com/p/chromium/issues/detail?id=539385
- https://code.google.com/p/chromium/issues/detail?id=545467
