import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export function renderChart(container, data) {
  if (!data || data.length === 0) {
    container.innerHTML = "No data available.";
    return;
  }

  const width = 500;
  const height = 250;
  const marginTop = 40;
  const marginRight = 30;
  const marginBottom = 30;
  const marginLeft = 40;

  // X: Game index
  const x = d3
    .scaleLinear()
    .domain([0, data.length - 1])
    .range([marginLeft, width - marginRight]);

  // Y: Shared between score and accuracy
  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => Math.max(d.score, d.accuracy)) || 100])
    .nice()
    .range([height - marginBottom, marginTop]);

  // Score line (blue)
  const lineScore = d3
    .line()
    .x((d, i) => x(i))
    .y((d) => y(d.score));

  // Accuracy line (green)
  const lineAccuracy = d3
    .line()
    .x((d, i) => x(i))
    .y((d) => y(d.accuracy));

  const svg = d3
    .create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto;");

  // Legend group
  const legend = svg
    .append("g")
    .attr("transform", `translate(${marginLeft}, ${marginTop})`);

  // X Axis
  svg
    .append("g")
    .attr("transform", `translate(0,${height - marginBottom})`)
    .call(
      d3
        .axisBottom(x)
        .ticks(Math.min(data.length, 10))
        .tickFormat((i) => `#${i + 1}`)
    );

  // Y Axis
  svg
    .append("g")
    .attr("transform", `translate(${marginLeft},0)`)
    .call(d3.axisLeft(y).ticks(5))
    .call((g) => g.select(".domain").remove())
    .call((g) =>
      g
        .selectAll(".tick line")
        .clone()
        .attr("x2", width - marginLeft - marginRight)
        .attr("stroke-opacity", 0.1)
    )
    .call((g) =>
      g
        .append("text")
        .attr("x", -marginLeft + 5)
        .attr("y", 10)
        .attr("fill", "currentColor")
        .attr("text-anchor", "start")
        .text("↑ Score / Accuracy")
    );

  // Score Line (blue)
  svg
    .append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1.5)
    .attr("d", lineScore);

  // Accuracy Line (green)
  svg
    .append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "green")
    .attr("stroke-width", 1.5)
    .attr("d", lineAccuracy);

  // Score legend (blue)
  legend
    .append("circle")
    .attr("cx", 0)
    .attr("cy", -15)
    .attr("r", 5)
    .attr("fill", "steelblue");

  legend
    .append("text")
    .attr("x", 10)
    .attr("y", -8)
    .text("Score")
    .attr("fill", "white")
    .style("font-size", "12px");

  // Accuracy legend (green)
  legend
    .append("circle")
    .attr("cx", 80)
    .attr("cy", -15)
    .attr("r", 5)
    .attr("fill", "green");

  legend
    .append("text")
    .attr("x", 90)
    .attr("y", -8)
    .text("Accuracy")
    .attr("fill", "white")
    .style("font-size", "12px");

  // Render
  container.innerHTML = "";
  container.appendChild(svg.node());
}
