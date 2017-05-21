# Medial Axis Transform (MAT) - SVG focused
A pure javascript Medial/Scale Axis Transform (MAT/SAT) library.

**[Demo](http://mat-demo.appspot.com)**

## Description

The [MAT](https://en.wikipedia.org/wiki/Medial_axis) is an analytical form of skeletonization of a shape. It is perfectly suited to SVG. Described by many scholars as *the most important image transform*, it has endless use cases, e.g.:
* **Morphing of one shape into another**
* **Shape thinning or fattening**
* **Shape classification**
* **Shape simplification**
* **Image compression**

The [SAT](http://www.balintmiklos.com/scale-axis/theory_socg_2009.html) is similar to the MAT (and indeed uses it as a starting point) but is *far more practical* as it removes insignifacant MAT branches based on the *local image scale*. The culling severity of branches is controlled by a parameter called *s*.

In the image below, the gray silhouette is the original SVG shape and the blue curves represents the SAT. The SAT is internally represented as a tree data structure with branches being cubic beziers (that can degenerate into quadratic beziers or lines).

![Alt text](https://raw.github.com/FlorisSteenkamp/MAT/master/github%20assets/two-hole.png)


<!-- SVGs from publicdomainvectors.org -->
