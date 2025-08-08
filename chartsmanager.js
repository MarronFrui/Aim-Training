import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export function drawGraphs(container, data, mode = "combined") {
  // mode = "combined" | "scoreOnly" | "accuracyOnly"

  if (!data || data.length === 0) {
    container.innerHTML = "No data available | ";
    return;
  }

  const width = 500;
  const height = 250;
  const marginTop = 40;
  const marginRight = 30;
  const marginBottom = 30;
  const marginLeft = 40;

  const x = d3
    .scaleLinear()
    .domain([0, data.length - 1])
    .range([marginLeft, width - marginRight]);

  // Compute max Y for the needed values based on mode
  let maxY;
  if (mode === "scoreOnly") {
    maxY = d3.max(data, (d) => d.score) || 100;
  } else if (mode === "accuracyOnly") {
    maxY = d3.max(data, (d) => d.accuracy) || 100;
  } else {
    maxY = d3.max(data, (d) => Math.max(d.score, d.accuracy)) || 100;
  }

  const y = d3
    .scaleLinear()
    .domain([0, maxY])
    .nice()
    .range([height - marginBottom, marginTop]);

  const lineScore = d3
    .line()
    .x((d, i) => x(i))
    .y((d) => y(d.score));

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

  // Conditionally add lines & legend based on mode

  if (mode === "scoreOnly" || mode === "combined") {
    svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", lineScore);

    // Score legend
    svg
      .append("circle")
      .attr("cx", marginLeft)
      .attr("cy", marginTop - 15)
      .attr("r", 5)
      .attr("fill", "steelblue");

    svg
      .append("text")
      .attr("x", marginLeft + 10)
      .attr("y", marginTop - 8)
      .text("Score")
      .attr("fill", "white")
      .style("font-size", "12px");
  }

  if (mode === "accuracyOnly" || mode === "combined") {
    svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "green")
      .attr("stroke-width", 1.5)
      .attr("d", lineAccuracy);

    // Accuracy legend
    svg
      .append("circle")
      .attr("cx", marginLeft + 80)
      .attr("cy", marginTop - 15)
      .attr("r", 5)
      .attr("fill", "green");

    svg
      .append("text")
      .attr("x", marginLeft + 90)
      .attr("y", marginTop - 8)
      .text("Accuracy")
      .attr("fill", "white")
      .style("font-size", "12px");
  }

  container.innerHTML = "";
  container.appendChild(svg.node());
}
