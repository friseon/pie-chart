## Pie Chart

> Simple plugin to create pie charts with toggle items.

## Get started

Usage:

```
<link rel="stylesheet" href="pie-chart.css">
```
```
<script src="pie-chart.js"></script>
```

#### Create container:

```
<div class="pie-chart-container"></div>
```

#### Create chart:

```
pieChart({
    data: data
}).drawPie();
```

## Options

#### Data exaple:
*[Default]*

```
var data = [
        {
            value: 40,
            label: "Thing1"
        },
        {
            value: 10,
            label: "Thing2"
        },
        {
            value: 10,
            label: "Thing3"
        },
        {
            value: 20,
            label: "Thing4"
        }
];

pieChart({
    data: data
}).drawPie();
```
*[dataType: "nameValue"]*

```
var data = {
    thing1: 200,
    thing2: 300,
    thing3: 50,
    thing4: 150,
    thing5: 25
};
pieChart({
    data: data,
    dataType: "nameValue"
}).drawPie();
```
---
#### size

Size of chart, default: 330.
```
pieChart({
    data: data,
    size: 400
}).drawPie();
```
---
#### tooltip

Tooltip on hover segments, default: true.
```
pieChart({
    data: data,
    tooltip: false
}).drawPie();
```
---
#### midCircle

MidCircle is a size of circle in the middle of chart, default: .8.
```
pieChart({
    data: data,
    midCircle: false
}).drawPie();
```

---
#### colors

Colors is a list with colors of segments.
```
var colors = [ "#dd3652", "#4fa622"]
```
```
pieChart({
    data: data,
    colors: colors
}).drawPie();
```
