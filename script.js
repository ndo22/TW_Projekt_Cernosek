document.addEventListener('DOMContentLoaded', async () => updateTable(), false);

const coffeeList = [
    { id: 1, title: "Cappuccino" },
    { id: 2, title: "FlatWhite" },
    { id: 3, title: "Coffee" },
    { id: 4, title: "Espresso" },
    { id: 5, title: "Latte" },
    { id: 6, title: "Ristretto" },
];

function selectCoffee(id) {
    storeCoffee(id)
    alert(`Coffee ${findCoffeeById(id).title} selected!`)
    updateTable()
}

function findCoffeeById(id) {
    return coffeeList.find(coffee => coffee.id === id)
}

function storeCoffee(id) {
    const storedCoffees = JSON.parse(localStorage.getItem("coffees"));
    if (!storedCoffees) {
        const coffees = [];
        coffees.push(id)
        localStorage.setItem("coffees", JSON.stringify(coffees));
    } else {
        storedCoffees.push(id);
        localStorage.setItem("coffees", JSON.stringify(storedCoffees));
    }
}

function updateTable() {
    clearTable()
    const storedCoffees = JSON.parse(localStorage.getItem("coffees"));
    if (storedCoffees == null) return
    const topCoffees = []
    coffeeList.forEach(coffee => {
        const count = storedCoffees.filter(id => coffee.id === id).length
        if (count != 0) { 
            const selected = { id: coffee.id, count }
            topCoffees.push(selected) 
        }
    })
    topCoffees.sort((a, b) => a.count - b.count).reverse()
    topCoffees.forEach(topCoffee => createEntryInTable(topCoffee))
    createChart(topCoffees)
    if (!isTableEmpty()) {
        document.getElementById("empty-table").innerHTML = ""
    }
}

function clearTable() {
    document.getElementById("top-table-body").innerHTML = ""
    document.getElementById("empty-table").innerHTML = "No Entries in the Table"
    if (document.getElementById("coffee-chart")) document.getElementById("coffee-chart").remove()
}

function createChart(topCoffees) {
    const context = createChartElement()
    const chartDiv = document.getElementById("chart-div")
    chartDiv.appendChild(context)
    new Chart(context, {
    type: 'bar',
    data: {
        labels: topCoffees.map(topCoffee => coffeeList.find(coffee => topCoffee.id === coffee.id).title ),
        datasets: [{
            label: 'Number of Coffees',
            data: topCoffees.map(coffee => coffee.count),
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        }
    }
    });
}

function createChartElement() {
    const context = document.createElement("canvas")
    context.setAttribute("height", 150)
    context.setAttribute("width", 400)
    context.setAttribute("id", "coffee-chart")
    return context
}

function isTableEmpty() {
    const storedCoffees = JSON.parse(localStorage.getItem("coffees"));
    return storedCoffees == null
}

function createEntryInTable(topCoffee) {
    const tableBody = document.getElementById("top-table-body")
    const tableRow = document.createElement("tr")

    const name = document.createElement("td")
    const count = document.createElement("td")

    const coffee = coffeeList.find(coffee => coffee.id === topCoffee.id)

    name.innerText = coffee.title
    count.innerText = topCoffee.count

    tableRow.appendChild(name)
    tableRow.appendChild(count)
    tableBody.appendChild(tableRow)
 }

function clearCoffees() {
    localStorage.clear()
    clearTable()
    alert("Successfully cleared!")
}