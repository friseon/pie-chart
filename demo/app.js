var data = [
        {
            value: 40,
            label: 'Thing 1'
        },
        {
            value: 10,
            label: "Thing Two"
        },
        {
            value: 10,
            label: "Another Thing"
        },
        {
            value: 20,
            label: "Item Z"
        },
        {
            value: 5,
            label: "Item A"
        },
        {
            value: 10,
            label: "Item X"
        },
        {
            value: 35,
            label: "Bla bla bla"
        }
];

var data2 = {
    thing1: 200,
    thing2: 300,
    thing3: 50,
    thing4: 150,
    thing5: 25
}

pieChart({
    data: data2,
    dataType: 'nameValue'
}).drawPie();