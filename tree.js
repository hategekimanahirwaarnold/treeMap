const tooltip = document.getElementById("tooltip");

const padding = 150;
const w = 800;
const h = 600;

let color1 = "rgb(73, 73, 241)";
let color2 = "aqua";
let color3 = "rgb(255, 249, 167)";
let color4 = "rgb(247, 165, 13)";
let color5 = "rgb(236, 114, 43)";
let color6 = "rgb(247, 48, 13)";

const svg = d3.select("body")
  .append("svg")
  .attr("width", w)
  .attr("height", h);

var legendData = [
  { color: color1, label: "Adventure" },
  { color: color2, label: "Action" },
  { color: color3, label: "Tabletop Games" },
  { color: color4, label: "Video Games" },
  { color: color5, label: "Product Design" },
  { color: color6, label: "wii" },
];

var legend = svg.append("g")
  .attr("id", "legend")
  .selectAll("g")
  .data(legendData)
  .enter()
  .append("g")
  .attr("transform", function (d, i) {
    return "translate( " + (w-padding-20 )+ "," + (padding -20 + i * 40) + ")";
  });

legend.append("rect")
  .attr("class", "legend-item")
  .attr("width", 90)
  .attr("height", 18)
  .style("fill", function (d) {
    return d.color;
  });

legend.append("text")
  .attr("x", 10)
  .attr("y", -2)
  .text(function (d) {
    return d.label;
  });

const g = svg.append("g");

// Load the data
Promise.all([
  fetch("https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json"),
  fetch("https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json"),
  fetch("https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json")
]).then(([made1, made2, made3]) => {
  Promise.all([
    made1.json(),
    made2.json(),
    made3.json()
  ]).then(([kPledges, movieSales, gameSales]) => {
    let first = kPledges.children;
    let second = movieSales.children;
    let third = gameSales.children;
    // console.log("first: ", kPledges)
    allItems = first.concat(second).concat(third)

    let sumOfL = first.length + second.length + third.length;

    //  console.log("firstL: ", first.length, "secondL: ", second.length, 
    //              "thirdL: ", third.length, "allL: ", allItems.length, "sumL: ", sumOfL)
    let allChildrens = [];
    allItems.forEach(item => {
      //console.log(item.name, item.children.length)
      let childrens = item.children;
      childrens.forEach(child => {
        allChildrens.push(child);
      })
    })
    // console.log("category: ", item.name, "children: ", childrens)
    //console.log("allChildrens: ", allChildrens)
    g.selectAll('rect')
      .data(allChildrens)
      .enter()
      .append('rect')
      .attr("class", "tile")
      .attr("data-name", d => {
       //  console.log("name: ", d.name)
        return d.name
      })
      .attr("data-category", d => d.category)
      .attr("data-value", d => d.value)

      .attr("fill", ((d) => {
        let cate = d.category;
        if (cate === "Adventure") {
          return color1
        } else if (cate === "Action") {
          return color2
        } if (cate === "Tabletop Games") {
          return color3
        } if (cate === "Video Games") {
          return color4
        } if (cate === "Product Design") {
          return color5
        } if (cate === "wii") {
          return color6
        } else {
         // console.log("not in the range: ", d);
          return "black"
        }
      }))
      .attr("x", ((d, i)=> {
        return i*2
      }))
      .attr("y", ((d, i)=> {
        return i*3
      }))
      .attr("width", ((d, i)=> {
        return 5
      }))
      .attr("height", ((d, i)=> {
        return 5
      }))
      .on("mouseover", ((d, event, i) => {
      // console.log("event", d.name, "event", event)
        // Show tooltip
        tooltip.style.display = "block";
      // Calculate tooltip position based on mouse coordinates
       const xPosition = d.pageX;
       const yPosition = d.pageY;

      // Update tooltip content with the education value
      tooltip.innerHTML = "name: " + d.name + "<br>"+ "value: " + d.value + "<br>";

      // Set the data-education attribute of the tooltip
      tooltip.setAttribute("data-value", d.value);

      // Position the tooltip
      tooltip.style.left = xPosition + "px";
      tooltip.style.top = yPosition + "px";
    }))
    .on("mouseout", function() {
      // Hide the tooltip on mouseout
      tooltip.style.display = "none";
    });
  })
}).catch(err => {
  console.log("There was an error: ", err)
});
